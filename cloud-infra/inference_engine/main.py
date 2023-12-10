import pickle
import mysql.connector
import os
import time
import grpc
import subinf_pb2
import subinf_pb2_grpc
from concurrent import futures
import pandas as pd
import numpy as np

# Assuming you have implemented gRPC service
# from your_grpc_module import YourPredictServiceServicer, add_YourPredictServiceServicer_to_server

# Configuration for MySQL
MYSQL_HOST = os.getenv('DB_HOST', 'mysql')
MYSQL_DATABASE = os.getenv('DB_NAME', 'your_database')
MYSQL_USER = os.getenv('DB_USER', 'your_user')
MYSQL_PASSWORD = os.getenv('DB_PASS', 'your_password')

# Configuration for model checking
MODEL_PATH = os.path.join(os.getcwd(), 'models', 'pipeline.pkl')
model = None

# Define the scaling function
def scale01(x):
    return (x - x.min()) / (x.max() - x.min())

def load_model():
    global model 
    while not os.path.exists(MODEL_PATH):
        print("Waiting for model file...")
        time.sleep(10)  # Check every 10 seconds
    with open(MODEL_PATH, 'rb') as file:
        model = pickle.load(file)
    print("Model loaded.")

# Function to push data to MySQL
def push_to_database(data):
    # Unpack tuple values if necessary
    for key, value in data.items():
        if isinstance(value, tuple):
            data[key] = value[0]
        if isinstance(value, np.ndarray):
            data[key] = value.item()
    if isinstance(data['device_name'], tuple):
        data['device_name'] = data['device_name'][0]
    if isinstance(data['timestamp'], tuple):
        data['timestamp'] = data['timestamp'][0]

    try:
        connection = mysql.connector.connect(
            host=MYSQL_HOST,
            database=MYSQL_DATABASE,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD)
        if connection.is_connected():
            cursor = connection.cursor()
            # Prepare your INSERT query
            query = """
            INSERT INTO sensor_data (device, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, activity, timestamp)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            # Prepare the data tuple
            data_tuple = (
                data["device_name"], 
                data["acceleration_x"], 
                data["acceleration_y"], 
                data["acceleration_z"], 
                data["gyro_x"], 
                data["gyro_y"], 
                data["gyro_z"], 
                data["result"],  # Assuming 'result' is the activity (tinyint)
                data["timestamp"]
            )
            print(data_tuple)
            # Execute the query
            cursor.execute(query, data_tuple)
            connection.commit()
            print("Data pushed to database")
            connection.close()
    except Exception as e:
        print("Error while connecting to MySQL", e)
        if connection.is_connected():
            connection.close()

# Define the gRPC service
class InferenceService(subinf_pb2_grpc.InferenceServiceServicer):
    def ProcessData(self, request, context):
        # Extract data from request
        data = {
            "acceleration_x": request.acceleration_x,
            "acceleration_y": request.acceleration_y,
            "acceleration_z": request.acceleration_z,
            "gyro_x": request.gyro_x,
            "gyro_y": request.gyro_y,
            "gyro_z": request.gyro_z
        }

        # Convert to DataFrame for processing
        df = pd.DataFrame([data])

        # Apply the model
        # Assuming your model expects a DataFrame and returns a result
        result = model.predict(df)

        # Combine result with device name and timestamp
        print(result.item())
        
        data["device_name"] = request.device_name,
        data["timestamp"] = request.timestamp,
        data["result"] = result.item()  # Assuming the result is a single value
    

        print(data)
        # Push to database
        push_to_database(data)

        # Return a response (modify as per your requirement)
        return subinf_pb2.InferenceResult(result=str(result[0]))

# Start gRPC server
def start_grpc_server():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    subinf_pb2_grpc.add_InferenceServiceServicer_to_server(InferenceService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    load_model()
    start_grpc_server()
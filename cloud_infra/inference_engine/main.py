import pickle
import mysql.connector
import os
import time
import grpc
# Assuming you have implemented gRPC service
# from your_grpc_module import YourPredictServiceServicer, add_YourPredictServiceServicer_to_server

# Configuration for MySQL
MYSQL_HOST = os.getenv('MYSQL_HOST', '0.0.0.0')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'your_database')
MYSQL_USER = os.getenv('MYSQL_USER', 'your_user')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'your_password')

# Configuration for model checking
MODEL_PATH = os.path.join(os.getcwd(), 'models', 'pipeline.pkl')
model = None

# Define the scaling function
def scale01(x):
    return (x - x.min()) / (x.max() - x.min())

def load_model():
    while not os.path.exists(MODEL_PATH):
        print("Waiting for model file...")
        time.sleep(10)  # Check every 10 seconds
    with open(MODEL_PATH, 'rb') as file:
        model = pickle.load(file)
    print("Model loaded.")

# Function to push data to MySQL
def push_to_database(data):
    try:
        connection = mysql.connector.connect(
            host=MYSQL_HOST,
            database=MYSQL_DATABASE,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD)
        if connection.is_connected():
            cursor = connection.cursor()
            query = "INSERT INTO your_table (columns) VALUES (%s, %s, ...)"
            cursor.execute(query, data)
            connection.commit()
            print("Data pushed to database")
            connection.close()
    except Exception as e:
        print("Error while connecting to MySQL", e)
        if connection.is_connected():
            connection.close()
# gRPC Service
# class YourService(YourPredictServiceServicer):
#     def Predict(self, request, context):
#         # Use the loaded model for prediction
#         # result = model.predict(process_request_data(request))
#         # push_to_database(result)
#         return YourPredictResponse(result)

# Load model
load_model()

# Start gRPC server
# server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
# add_YourPredictServiceServicer_to_server(YourService(), server)
# server.add_insecure_port('[::]:50051')
# server.start()
# server.wait_for_termination()

import paho.mqtt.client as mqtt
import pickle
import mysql.connector
import threading
import time
import os

# Configuration for MQTT
MQTT_BROKER = 'mosquitto'  # Use the service name defined in docker-compose
MQTT_PORT = 1883
MQTT_TOPIC = 'your/topic'

# Configuration for MySQL
MYSQL_HOST = 'mysql'  # Use the service name defined in docker-compose
MYSQL_DATABASE = 'your_database'
MYSQL_USER = 'your_user'
MYSQL_PASSWORD = 'your_password'

# Configuration for model checking
MODEL_PATH = '/models/model.pkl'
model = None
last_modified_time = None

def load_model():
    global model, last_modified_time
    if os.path.exists(MODEL_PATH):
        modified_time = os.path.getmtime(MODEL_PATH)
        if modified_time != last_modified_time:
            with open(MODEL_PATH, 'rb') as file:
                model = pickle.load(file)
                last_modified_time = modified_time
                print("Model loaded/updated.")
    else:
        print("Model file not found.")

def model_check_thread():
    while True:
        load_model()
        time.sleep(10)  # Check every 10 seconds

# Initialize model checking in a separate thread
threading.Thread(target=model_check_thread, daemon=True).start()

# [Remaining MQTT and MySQL setup]
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
            query = "INSERT INTO your_table (columns) VALUES (%s, %s, ...)"  # Customize your SQL query
            cursor.execute(query, data)
            connection.commit()
            print("Data pushed to database")
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

# Define the MQTT callbacks
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    print("Message received. Topic: {}. Payload: {}".format(msg.topic, str(msg.payload)))
    # Here you can add your inference logic using the loaded model
    # Example: result = model.predict(process_payload(msg.payload))
    # Then push the result to the database
    # Example: push_to_database(result)

# Setup MQTT client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_forever()

# The MQTT client setup, callback definitions, and loop would remain the same

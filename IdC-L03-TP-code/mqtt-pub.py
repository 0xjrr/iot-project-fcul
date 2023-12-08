import paho.mqtt.client as mqtt 
import time
import datetime
import json

broker_hostname = "0.0.0.0"
port = 8883 
topic = "sensor/data"

def on_connect(client, userdata, flags, return_code):
    if return_code == 0:
        print("connected")
    else:
        print("could not connect, return code:", return_code)

client = mqtt.Client("Client1")
# client.username_pw_set(username="user_name", password="password") # uncomment if you use password auth
client.on_connect=on_connect
client.tls_set(ca_certs="ca.crt", certfile="client.crt", keyfile="client.key")
client.tls_insecure_set(True)

client.connect(broker_hostname, port)
client.loop_start()

# Ask for device name input
device_name = input("Enter the device name: ")

# Function to process and publish data
def publish_sensor_data(file_name, device_name):
    with open(file_name, 'r') as file:
        headers = file.readline().strip().split(';')
        for line in file:
            data_values = line.strip().split(';')
            data_dict = dict(zip(headers, data_values))
            data_dict["device_name"] = device_name
            data_dict["timestamp"] = datetime.datetime.now().isoformat()
            json_data = json.dumps(data_dict)
            result = client.publish(topic, json_data)
            status = result[0]

            if status == 0:
                print("Message "+ str(json_data) + " is published to topic " + topic)
            else:
                print("Failed to send message to topic " + topic)

            time.sleep(1)  # Optional: sleep between messages

# File name
file_name = "online.csv"

# Publish data
publish_sensor_data(file_name, device_name)

# Keep the script running

print("Exiting...")
client.disconnect()
client.loop_stop()

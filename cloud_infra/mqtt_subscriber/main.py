import os
import json
import paho.mqtt.client as mqtt
import grpc
import subinf_pb2
import subinf_pb2_grpc

# MQTT Broker Information
MQTT_BROKER = os.getenv('MQTT_BROKER', '0.0.0.0')  # Use the service name defined in docker-compose
MQTT_PORT = int(os.getenv('MQTT_PORT', 8883))  # MQTT port
MQTT_TOPIC = os.getenv('MQTT_TOPIC', 'sensor/data')

print(f"MQTT Broker: {MQTT_BROKER}")
print(f"MQTT Port: {MQTT_PORT}")
print(f"MQTT Topic: {MQTT_TOPIC}")


# Paths to certificate files
CA_CERT = "certs/ca.crt"
CLIENT_CERT = "certs/client.crt"
CLIENT_KEY = "certs/client.key"

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    print(f"Message received on topic {msg.topic}: {msg.payload.decode()}")
    try:
        # Parse the MQTT message payload
        data = json.loads(msg.payload.decode())

        # Extract data and call the gRPC function
        send_data_to_inference(
            acceleration_x=float(data["acceleration_x"]),
            acceleration_y=float(data["acceleration_y"]),
            acceleration_z=float(data["acceleration_z"]),
            gyro_x=float(data["gyro_x"]),
            gyro_y=float(data["gyro_y"]),
            gyro_z=float(data["gyro_z"]),
            device_name=data["device_name"],
            timestamp=data["timestamp"]
        )
    except json.JSONDecodeError as e:
        print("Error decoding JSON:", e)
    except KeyError as e:
        print("Missing data in message:", e)

def send_data_to_inference(acceleration_x, acceleration_y, acceleration_z, gyro_x, gyro_y, gyro_z, device_name, timestamp):
    with grpc.insecure_channel('ml-inference:50051') as channel:
        stub = subinf_pb2_grpc.InferenceServiceStub(channel)
        response = stub.ProcessData(subinf_pb2.SensorData(
            acceleration_x=acceleration_x,
            acceleration_y=acceleration_y,
            acceleration_z=acceleration_z,
            gyro_x=gyro_x,
            gyro_y=gyro_y,
            gyro_z=gyro_z,
            device_name=device_name,
            timestamp=timestamp
        ))
        print("Inference result:", response.result)

# Create MQTT client instance
client = mqtt.Client()

# Assign callback functions
client.on_connect = on_connect
client.on_message = on_message

# Configure TLS set
client.tls_set(ca_certs=CA_CERT, certfile=CLIENT_CERT, keyfile=CLIENT_KEY)
client.tls_insecure_set(True)


# Connect to MQTT Broker
client.connect(MQTT_BROKER, MQTT_PORT, 60)

# Start the loop
client.loop_forever()

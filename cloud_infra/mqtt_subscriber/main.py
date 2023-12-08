import paho.mqtt.client as mqtt
import os

# MQTT Broker Information
MQTT_BROKER = os.getenv('MQTT_BROKER', '0.0.0.0')  # Use the service name defined in docker-compose
MQTT_PORT = int(os.getenv('MQTT_PORT', 8883))  # MQTT port
MQTT_TOPIC = os.getenv('MQTT_TOPIC', 'your/topic')

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

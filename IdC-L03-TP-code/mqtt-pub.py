import paho.mqtt.client as mqtt 
import time
import random

broker_hostname = "0.0.0.0"
port = 1883 

def on_connect(client, userdata, flags, return_code):
    if return_code == 0:
        print("connected")
    else:
        print("could not connect, return code:", return_code)

client = mqtt.Client("Client1")
# client.username_pw_set(username="user_name", password="password") # uncomment if you use password auth
client.on_connect=on_connect

client.connect(broker_hostname, port)
client.loop_start()

topic = "idc/iris"
msg_count = 0

# msg = []
# msg.append('[{"model":"iris-KNN"},{"SepalLengthCm":5.9,"SepalWidthCm":3,"PetalLengthCm":5.1,"PetalWidthCm":1}]')
# msg.append('[{"model":"iris-GNB"},{"SepalLengthCm":5.9,"SepalWidthCm":3,"PetalLengthCm":5.1,"PetalWidthCm":1}]')
# msg.append('[{"model":"iris-SVC"},{"SepalLengthCm":5.9,"SepalWidthCm":3,"PetalLengthCm":5.1,"PetalWidthCm":1}]')
# msg.append('[{"model":"iris-DT"},{"SepalLengthCm":5.9,"SepalWidthCm":3,"PetalLengthCm":5.1,"PetalWidthCm":1}]')
# msg.append('[{"model":"iris-LR"},{"SepalLengthCm":5.9,"SepalWidthCm":3,"PetalLengthCm":5.1,"PetalWidthCm":1}]')
# msg.append('[{"model":"iris-LDA"},{"SepalLengthCm":5.9,"SepalWidthCm":3,"PetalLengthCm":5.1,"PetalWidthCm":1}]')


try:
    while True:
        if msg_count == 0:
            msg = []
            models = ["iris-KNN", "iris-GNB", "iris-SVC", "iris-DT", "iris-LR", "iris-LDA"]

            for model in models:
                element = {
                    "model": model,
                    "SepalLengthCm": round(random.uniform(4.0, 7.9), 1),
                    "SepalWidthCm": round(random.uniform(2.0, 4.4), 1),
                    "PetalLengthCm": round(random.uniform(1.0, 6.9), 1),
                    "PetalWidthCm": round(random.uniform(0.1, 2.5), 1)
                }
                msg.append(str(element))

        time.sleep(1)
        result = client.publish(topic, msg[msg_count])
        status = result[0]
        if status == 0:
            print("Message "+ str(msg[msg_count]) + " is published to topic " + topic)
        else:
            print("Failed to send message to topic " + topic)
        msg_count = msg_count + 1
        msg_count = msg_count % 5

finally:
    client.loop_stop()

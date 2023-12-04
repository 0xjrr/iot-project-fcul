#!/bin/bash

# Replace with the actual file path
FILE_PATH="/home/xjrr/fcul/IOT/iot-project-fcul/iot-project-fcul/data/train.csv"

# Replace with the actual endpoint
ENDPOINT="http://localhost:8080/data"

# Sensor name
SENSOR_NAME="XPTO03"

# Skip the first line if it's a header
tail -n +2 "$FILE_PATH" | while IFS=';' read -r date time activity ax ay az gx gy gz
do
    # Convert activity to boolean
    ACTIVITY_BOOL=$( [ "$activity" -eq 0 ] && echo "false" || echo "true" )

    # Format the date and time into an ISO 8601 format
    TIMESTAMP=$(date -d"${date:6:4}-${date:3:2}-${date:0:2} ${time:0:8}" --iso-8601=seconds)

    # Create a JSON object
    JSON_PAYLOAD=$(cat <<EOF
{
    "Device": "$SENSOR_NAME",
    "AccelX": $ax,
    "AccelY": $ay,
    "AccelZ": $az,
    "GyroX": $gx,
    "GyroY": $gy,
    "GyroZ": $gz,
    "Activity": $ACTIVITY_BOOL,
    "Timestamp": "$TIMESTAMP"
}
EOF
)

    # Send the data using curl and print the response
    RESPONSE=$(curl -s -X POST "$ENDPOINT" \
        -H "Content-Type: application/json" \
        -d "$JSON_PAYLOAD")

    echo "Response from server: $RESPONSE"
done


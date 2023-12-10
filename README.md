---

# IoT Sensor Data Processing and Visualization Project

This repository contains the infrastructure and application code for an end-to-end IoT device data processing and visualization platform. Utilizing Docker Compose for container orchestration, the system captures, processes, and visualizes sensor data in real time.

## Components

- `backend_web`: The backend API developed in Go, responsible for handling requests from the frontend and interfacing with the database.
- `frontend_web`: A React-based frontend for visualizing sensor data.
- `inference_engine`: A machine learning inference engine that consumes processed data to make predictions.
- `ml_training`: A training environment for machine learning models.
- `mqtt_subscriber`: A service that subscribes to MQTT topics to receive sensor data.
- `mysql`: The database for storing sensor data.
- `phpmyadmin` & `adminer`: Database management tools accessible via web UI.

## Getting Started

To get the infrastructure up and running, make sure you have Docker and Docker Compose installed on your system.

### Installation

1. Clone the repository to your local machine.
2. Navigate to the `cloud-infra` directory.
3. Run the Docker Compose command:
   ```sh
   docker-compose up -d
   ```

This will pull the necessary Docker images, build the services, and start the containers as defined in the `docker-compose.yml` file.

### Services

- **Mosquitto:** An MQTT broker for handling messages from IoT devices.
- **MQTT Subscriber:** Listens for data on specific topics from the MQTT broker.
- **Machine Learning Training:** Processes historical data to train machine learning models.
- **Machine Learning Inference:** Applies trained models to new data to generate insights.
- **Go Backend:** Manages interactions between the frontend and the database.
- **React Frontend:** Displays sensor data and insights in an interactive dashboard.
- **MySQL:** Stores sensor data for processing and visualization.
- **Adminer & PHPMyAdmin:** Web clients for database management.

### Network Configuration

Each service is assigned a unique IP address within the custom bridge network `idc-net`. Refer to the `docker-compose.yml` file for the specific IP assignments.

### Environment Variables

Environment variables for database credentials, service ports, and other configurations are set within the `docker-compose.yml` file. Ensure these values are secured and conform to your environment's standards before deploying in a production setting.

### Volumes

Persistent volumes are defined for data storage to ensure data is maintained between container restarts. For details on the mounted volumes, refer to the `docker-compose.yml` file.

## Usage

After starting the services, you can:

- Access the frontend at `http://localhost:3000`.
- Interact with the backend API at `http://localhost:8080`.
- Manage the database via PHPMyAdmin at `http://localhost:8082` or Adminer at `http://localhost:8081`.


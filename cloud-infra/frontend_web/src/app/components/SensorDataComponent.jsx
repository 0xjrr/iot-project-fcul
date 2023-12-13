"use client"
import React, { useEffect, useState } from 'react';

const SensorDataComponent = () => {
    const [sensorData, setSensorData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/data?sensorName=Device001');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSensorData(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Sensor Data</h1>
            {sensorData.length > 0 ? (
                <ul>
                    {sensorData.map((data, index) => (
                        <li key={index}>
                            {/* Display your sensor data here */}
                            Device: {data.Device}, AccelX: {data.AccelX}, AccelY: {data.AccelY}, ...
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No sensor data available.</p>
            )}
        </div>
    );
};

export default SensorDataComponent;

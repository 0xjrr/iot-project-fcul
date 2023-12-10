"use client";

import {
  Grid,
  Col,
  Card,
  Text,
  Metric,
  Flex,
  AreaChart,
  Title,
} from "@tremor/react";
import { useEffect, useState } from "react";
import IconFlameOutline from "./IconFlameOutline";
import IconIconClock from "./IconIconClock";
import IconPinDistanceLine from "./IconPinDistanceLine";
import IconRefresh from "./IconRefresh";
import IconAppleWatch from "./IconAppleWatch";

const DashboardGrid = ({ selectedUser }) => {
  const [timeGrouping, setTimeGrouping] = useState("day"); // 'day' or 'month'
  const [sensorData, setSensorData] = useState([]);
  const [caloriesChartData, setCaloriesChartData] = useState([]);
  const [distanceChartData, setDistanceChartData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/data/activity?sensorName=${selectedUser.Device}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSensorData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchCaloriesAndDistanceData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/data/activity-grouping?sensorName=${selectedUser.Device}&timeGrouping=${timeGrouping}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Process data for chart
      const caloriesData = data.map((item) => ({
        date: item.time_grouping,
        WalkingCalories: item.walking_calories,
        RunningCalories: item.running_calories,
      }));
      setCaloriesChartData(caloriesData);

      const distanceData = data.map((item) => ({
        date: item.time_grouping,
        WalkingDistance: item.walking_distance_meters,
        RunningDistance: item.running_distance_meters,
      }));
      setDistanceChartData(distanceData);
    } catch (error) {
      setError(error.message);
      setCaloriesChartData([]);
      setDistanceChartData([]);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchData();
      fetchCaloriesAndDistanceData();
    }
  }, [selectedUser, timeGrouping]);

  return (
    <>
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4">
        <Col numColSpan={1} numColSpanLg={3}>
          <Card>
            <Flex>
              <Text>
                {selectedUser
                  ? `${selectedUser.Name}`
                  : "Select User or Create One"}
              </Text>
              <button onClick={fetchData}>
                <IconRefresh
                  className="text-white-700"
                  width="30px"
                  height="30px"
                />
              </button>
            </Flex>
            {selectedUser && (
              <Flex>
                <Metric>
                  Device {selectedUser ? `${selectedUser.Device}` : " "}
                </Metric>
                <IconAppleWatch
                  className="text-white-700"
                  width="30px"
                  height="30px"
                />
                <button
                  className="my-4"
                  onClick={() =>
                    setTimeGrouping(timeGrouping === "day" ? "month" : "day")
                  }
                >
                  {timeGrouping === "day" ? "Switch to Month" : "Switch to Day"}
                </button>
              </Flex>
            )}
          </Card>
        </Col>
        {sensorData &&
          sensorData.map((data, index) => (
            <>
              <Card key={index}>
                <Flex alignItems="center">
                  <Title>
                    {"Total Distance "}{" "}
                    {data.activity.charAt(0).toUpperCase() +
                      data.activity.slice(1)}
                  </Title>
                  <IconPinDistanceLine
                    className="text-white-700"
                    width="30px"
                    height="30px"
                  />
                </Flex>
                <Metric>{`${data.activity_meters.toFixed(0)} meters`}</Metric>
              </Card>
              <Card key={index}>
                <Flex alignItems="center">
                  <Title>
                    {"Total Minutes "}
                    {data.activity.charAt(0).toUpperCase() +
                      data.activity.slice(1)}
                  </Title>

                  <IconIconClock
                    className="text-white-700"
                    width="30px"
                    height="30px"
                  />
                </Flex>
                <Metric>{`${data.minutes.toFixed(0)}`}</Metric>
              </Card>
              <Card key={index}>
                <Flex alignItems="center">
                  <Title>
                    {"Total Calories Burned "}
                    {data.activity.charAt(0).toUpperCase() +
                      data.activity.slice(1)}
                  </Title>
                  <IconFlameOutline
                    className="text-white-700"
                    width="30px"
                    height="30px"
                  />
                </Flex>
                <Metric>{`${(data.calories_per_minute * data.minutes).toFixed(
                  2
                )}`}</Metric>
              </Card>
            </>
          ))}
        {/* Calories Chart */}
        {caloriesChartData && caloriesChartData.length > 0 && (
          <Col numColSpan={1} numColSpanLg={3}>
            <Card>
              <Title>Calories Burned Over Time</Title>
              <AreaChart
                className="h-72 mt-4"
                data={caloriesChartData}
                index="date"
                categories={["WalkingCalories", "RunningCalories"]}
                colors={["orange", "red"]}
                valueFormatter={(number) => `${number.toFixed(0)} cal`}
              />
            </Card>
          </Col>
        )}

        {distanceChartData && distanceChartData.length > 0 && (
          <Col numColSpan={1} numColSpanLg={3}>
            <Card>
              <Title>Distance Over Time</Title>
              <AreaChart
                className="h-72 mt-4"
                data={distanceChartData}
                index="date"
                categories={["WalkingDistance", "RunningDistance"]}
                colors={["blue", "green"]}
                valueFormatter={(number) => `${number.toFixed(0)} meters`}
              />
            </Card>
          </Col>
        )}
      </Grid>
    </>
  );
};

export default DashboardGrid;

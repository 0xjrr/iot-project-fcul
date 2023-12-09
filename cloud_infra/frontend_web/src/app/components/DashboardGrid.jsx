"use client";

import {
  Grid,
  Col,
  Card,
  Text,
  Metric,
  Flex,
  ProgressCircle,
  AreaChart,
  Title,
} from "@tremor/react";
import { useEffect, useState } from "react";
import IconFlameOutline from "./IconFlameOutline";
import IconIconClock from "./IconIconClock";
import IconPinDistanceLine from "./IconPinDistanceLine";
import IconRefresh from "./IconRefresh";
import IconAppleWatch from "./IconAppleWatch";

const chartdata = [
  {
    date: "Jan 22",
    Walking: 2890,
    Activity: 1175,
  },
  {
    date: "Feb 22",
    Walking: 1156,
    Activity: 3475,
  },
  {
    date: "Mar 22",
    Walking: 1122,
    Activity: 3475,
  },
  {
    date: "Apr 22",
    Walking: 3470,
    Activity: 1175,
  },
  {
    date: "May 22",
    Walking: 2075,
    Activity: 3475,
  },
  {
    date: "Jun 22",
    Walking: 1129,
    Activity: 3475,
  },
];

const valueFormatter = function (number) {
  return new Intl.NumberFormat("us").format(number).toString() + "\nmeters";
};

const DashboardGrid = ({ selectedUser }) => {
  const [sensorData, setSensorData] = useState([]);
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

  useEffect(() => {
    if (selectedUser) {
      fetchData();
    }
  }, [selectedUser]);

  return (
    <>
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4">
        <Col numColSpan={1} numColSpanLg={3}>
          <Card>
            <Flex>
              <Text>{selectedUser ? `${selectedUser.Name}` : "Select User or Create One"}</Text>

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
                    {"Total Distance "}
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
        <Card className="max-w-sm mx-auto">
          <Flex className="space-x-5" justifyContent="start">
            <ProgressCircle value={75.5} size="lg" />
            <div>
              <Text className="font-medium text-gray-700">
                Value Callout (75%)
              </Text>
              <Text>Text context</Text>
            </div>
          </Flex>
        </Card>
        <Col numColSpan={1} numColSpanLg={2}>
          <Card>
            <Title>Distance over time</Title>
            <AreaChart
              className="h-72  mt-4"
              data={chartdata}
              index="date"
              categories={["Walking", "Activity"]}
              colors={["indigo", "cyan"]}
              valueFormatter={valueFormatter}
            />
          </Card>
        </Col>
      </Grid>
    </>
  );
};

export default DashboardGrid;

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
import { useEffect } from "react";

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
  return new Intl.NumberFormat("us").format(number).toString() + "\nmeters" ;
};

// useEffect(() => {
  //
  // })
  const DashboardGrid = ({ selectedUser }) => (
    <>
    <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4">
      <Col numColSpan={1} numColSpanLg={2}>
        <Card>
          <Text>{selectedUser ? `${selectedUser.Name}` : "Teste"}</Text>
          <Metric>KPI 1</Metric>
        </Card>
      </Col>
      <Card>
        <Text>Title</Text>
        <Metric>KPI 2</Metric>
      </Card>
      <Col>
        <Card>
          <Text>Title</Text>
          <Metric>KPI 3</Metric>
        </Card>
      </Col>
      <Card>
        <Text>Title</Text>
        <Metric>KPI 4</Metric>
      </Card>
      <Card>
        <Text>Title</Text>
        <Metric>KPI 5</Metric>
      </Card>
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

export default DashboardGrid;

"use client";
import {
  Grid,
  Col,
  Card,
  Text,
  Metric,
  Flex,
  ProgressCircle,
} from "@tremor/react";

export default () => (
  <>
    <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4">
      <Col numColSpan={1} numColSpanLg={2}>
        <Card>
          <Text>Title</Text>
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
            <Text className="font-medium text-gray-700">Value Callout (75%)</Text>
            <Text>Text context</Text>
          </div>
        </Flex>
      </Card>
    </Grid>
  </>
);

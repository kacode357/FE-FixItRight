import { Card } from "antd";
import { Line } from "@ant-design/charts";

interface RevenueByDayProps {
  weeklyData: { day: string; revenue: number; count: number }[];
  loading: boolean;
}

const RevenueByDay: React.FC<RevenueByDayProps> = ({ weeklyData, loading }) => {
  const revenueLineConfig = {
    data: weeklyData,
    xField: "day",
    yField: "revenue",
    label: { position: "middle", style: { fill: "#FFFFFF", opacity: 0.6 } },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: { day: { alias: "Day of the Week" }, revenue: { alias: "Total Revenue (VND)" } },
    smooth: true,
    color: "#1890ff",
  };

  return (
    <Card title="Revenue by Day of the Week" loading={loading}>
      <Line {...revenueLineConfig} height={400} />
    </Card>
  );
};

export default RevenueByDay;

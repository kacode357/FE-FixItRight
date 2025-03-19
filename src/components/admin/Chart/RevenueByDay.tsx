import { Card } from "antd";
import { Column } from "@ant-design/charts"; // Thay Line bằng Column

interface RevenueByDayProps {
  weeklyData: { day: string; revenue: number; count: number }[];
  loading: boolean;
}

const RevenueByDay: React.FC<RevenueByDayProps> = ({ weeklyData, loading }) => {
  const revenueColumnConfig = {
    data: weeklyData,
    xField: "day",
    yField: "revenue",
    label: {
      position: "top",
      style: { fill: "#000000", opacity: 0.6 },
    },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: { day: { alias: "Day of the Week" }, revenue: { alias: "Total Revenue (VND)" } },
    color: "#1890ff",
  };

  return (
    <Card title="Revenue by Day of the Week" loading={loading}>
      <Column {...revenueColumnConfig} height={300} />
    </Card>
  );
};

export default RevenueByDay;

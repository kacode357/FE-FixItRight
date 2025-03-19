import { Card } from "antd";
import { Column } from "@ant-design/charts"; // Thay Line bằng Column

interface CompletedOrdersByDayProps {
  weeklyData: { day: string; revenue: number; count: number }[];
  loading: boolean;
}

const CompletedOrdersByDay: React.FC<CompletedOrdersByDayProps> = ({ weeklyData, loading }) => {
  const countColumnConfig = {
    data: weeklyData,
    xField: "day",
    yField: "count",
    label: {
      position: "top", // Đặt label phía trên cột
      style: { fill: "#000000", opacity: 0.6 },
    },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: { day: { alias: "Day of the Week" }, count: { alias: "Completed Orders" } },
    color: "#52c41a",
  };

  return (
    <Card title="Completed Orders by Day of the Week" loading={loading}>
      <Column {...countColumnConfig} height={300} />
    </Card>
  );
};

export default CompletedOrdersByDay;

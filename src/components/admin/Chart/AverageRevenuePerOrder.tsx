import { Card, Statistic } from "antd";

interface AverageRevenuePerOrderProps {
  completedRevenue: number;
  totalOrders: number;
  loading: boolean;
}

const AverageRevenuePerOrder: React.FC<AverageRevenuePerOrderProps> = ({ completedRevenue, totalOrders, loading }) => {
  return (
    <Card bordered={false} className="bg-yellow-50 hover:bg-yellow-100 transition" loading={loading}>
      <Statistic
        title="Total Users"
        value={totalOrders > 0 ? (completedRevenue / totalOrders).toFixed(2) : 0}
        className="text-yellow-600"
      />
    </Card>
  );
};

export default AverageRevenuePerOrder;

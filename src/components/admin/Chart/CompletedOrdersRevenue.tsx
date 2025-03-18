import React, { useState, useEffect } from "react";
import { Card, Statistic } from "antd";
import { bookingService } from "../../../services/bookingService";

type CompletedOrdersRevenueProps = {
    loading: boolean;
    completedRevenue: number;
  };

const CompletedOrdersRevenue: React.FC<CompletedOrdersRevenueProps> = ({ loading }) => {
  const [completedRevenue, setCompletedRevenue] = useState<number>(0);

  const fetchCompletedOrdersRevenue = async () => {
    try {
      const data = await bookingService.getAllBookings("Completed", 1, 10);
      const totalRevenue = data.reduce((acc: number, item: any) => acc + item.Service.Price, 0);
      setCompletedRevenue(totalRevenue); // Cập nhật doanh thu
    } catch (error) {
      console.error("Error fetching completed orders revenue:", error);
    }
  };

  useEffect(() => {
    fetchCompletedOrdersRevenue();
  }, []);

  return (
    <Card bordered={false} className="bg-green-50 hover:bg-green-100 transition" loading={loading}>
      <Statistic title="Completed Orders Revenue" value={completedRevenue} prefix="VND" className="text-green-600" />
    </Card>
  );
};

export default CompletedOrdersRevenue;

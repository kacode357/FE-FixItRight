import { useEffect, useState } from "react";
import { Card } from "antd";
import { Column } from "@ant-design/charts";
import { bookingService } from "../../../services/bookingService";

const MonthlyRevenueChart = () => {
  const [monthlyData, setMonthlyData] = useState<{ month: string; revenue: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await bookingService.getAllBookings("Completed", 1, 1000);
        const monthRevenueMap: { [key: string]: number } = {};

        bookings.forEach((booking: any) => {
          const date = new Date(booking.WorkingDate);
          const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // yyyy-MM
          monthRevenueMap[month] = (monthRevenueMap[month] || 0) + (booking.Service?.Price || 0);
        });

        const formatted = Object.entries(monthRevenueMap).map(([month, revenue]) => ({
          month,
          revenue,
        }));

        setMonthlyData(formatted);
      } catch (error) {
        console.error("Error loading monthly revenue:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const config = {
    data: monthlyData,
    xField: "month",
    yField: "revenue",
    label: {
      position: "top",
      style: { fill: "#000", opacity: 0.6 },
    },
    meta: {
      month: { alias: "Month" },
      revenue: { alias: "Revenue (VND)" },
    },
    color: "#1890ff",
  };

  return (
    <Card title="Revenue by Month" loading={loading}>
      <Column {...config} height={300} />
    </Card>
  );
};

export default MonthlyRevenueChart;

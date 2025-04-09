import { useEffect, useState } from "react";
import { Card } from "antd";
import { Column } from "@ant-design/charts";
import { bookingService } from "../../../services/bookingService";

const MonthlyOrdersChart = () => {
  const [monthlyData, setMonthlyData] = useState<{ month: string; count: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookings = await bookingService.getAllBookings("Completed", 1, 1000);
        const monthOrderMap: { [key: string]: number } = {};

        bookings.forEach((booking: any) => {
          const date = new Date(booking.WorkingDate);
          const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // yyyy-MM
          monthOrderMap[month] = (monthOrderMap[month] || 0) + 1;
        });

        const formatted = Object.entries(monthOrderMap).map(([month, count]) => ({
          month,
          count,
        }));

        setMonthlyData(formatted);
      } catch (error) {
        console.error("Error loading monthly orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const config = {
    data: monthlyData,
    xField: "month",
    yField: "count",
    label: {
      position: "top",
      style: { fill: "#000", opacity: 0.6 },
    },
    meta: {
      month: { alias: "Tháng" },
      count: { alias: "Số đơn hoàn thành" },
    },
    color: "#52c41a",
  };

  return (
    <Card title="Completed Orders by month" loading={loading}>
      <Column {...config} height={300} />
    </Card>
  );
};

export default MonthlyOrdersChart;

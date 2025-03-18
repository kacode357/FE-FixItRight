import React, { useState, useEffect } from "react";
import { Card } from "antd";
import { Line } from "@ant-design/charts";
import { bookingService } from "../../../services/bookingService";

type CompletedOrdersByDayProps = {
    loading: boolean;
    weeklyData: { day: string; revenue: number; count: number }[];
  };

const CompletedOrdersByDay: React.FC<CompletedOrdersByDayProps> = ({ loading }) => {
  const [weeklyData, setWeeklyData] = useState<{ day: string; revenue: number; count: number }[]>([]);

  const fetchCompletedOrders = async () => {
    try {
      const data = await bookingService.getAllBookings("Completed", 1, 10);
      const formattedData: { [key: string]: { day: string; count: number; revenue: number } } = {};

      data.forEach((item: any) => {
        const workingDate = new Date(item.WorkingDate);
        console.log("Working date:", workingDate);
        const dayOfWeek = workingDate.toLocaleDateString("en-US", { weekday: 'short' }); 
        console.log("Day of week:", dayOfWeek);
        if (!formattedData[dayOfWeek]) {
          formattedData[dayOfWeek] = { day: dayOfWeek, count: 0, revenue: 0 };
        }
        console.log("Item service price:", item.Service.Price);
        formattedData[dayOfWeek].count += 1;
        formattedData[dayOfWeek].revenue += item.Service.Price; 
      });

      const resultData = Object.values(formattedData);
      console.log("Result data:", resultData);
      setWeeklyData(resultData); 
    } catch (error) {
      console.error("Error fetching completed orders:", error);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const countLineConfig = {
    data: weeklyData,
    xField: "day",
    yField: "count",
    label: { position: "middle", style: { fill: "#FFFFFF", opacity: 0.6 } },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: { day: { alias: "Day of the Week" }, count: { alias: "Completed Orders" } },
    smooth: true,
    color: "#52c41a",
  };

  return (
    <Card title="Completed Orders by Day of the Week" loading={loading}>
      <Line {...countLineConfig} height={400} />
    </Card>
  );
};

export default CompletedOrdersByDay;

import { useState, useEffect } from "react";
import { Layout, Card, Row, Col, Statistic } from "antd";
import { Line } from "@ant-design/charts";
import { bookingService } from "../../../services/bookingService";
import "./Chart.css";

const { Header, Content } = Layout;

const Chart = () => {
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; revenue: number; count: number }[]>([]);
  const [completedRevenue, setCompletedRevenue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // Chỉ lấy các đơn hàng có Status = "Completed"
        const completedBookings: Booking[] = await bookingService.getAllBookings("Completed", 1, 1000);
        setBookingData(completedBookings);

        // Tính tổng doanh thu của các đơn "Completed"
        const completedRev = completedBookings.reduce((sum, booking) => sum + booking.Service.Price, 0);
        setCompletedRevenue(completedRev);

        // Tính dữ liệu theo ngày trong tuần
        const dayRevenueMap: { [key: string]: { revenue: number; count: number } } = {};
        completedBookings.forEach((booking) => {
          const date = new Date(booking.WorkingDate);
          const day = date.toLocaleString("en-US", { weekday: "long" });
          if (!dayRevenueMap[day]) {
            dayRevenueMap[day] = { revenue: 0, count: 0 };
          }
          dayRevenueMap[day].revenue += booking.Service.Price;
          dayRevenueMap[day].count += 1;
        });

        const weekly = Object.entries(dayRevenueMap).map(([day, { revenue, count }]) => ({
          day,
          revenue,
          count,
        }));
        setWeeklyData(weekly);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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
    <>
      <Header className="bg-white p-4">
        <h1 className="text-2xl font-bold">Weekly Completed Bookings Statistics</h1>
      </Header>
      <Content className="p-6 bg-white rounded-lg">
        <Row gutter={[16, 16]} className="mb-6">
          <Col span={12}>
            <Card bordered={false} className="bg-green-50 hover:bg-green-100 transition" loading={loading}>
              <Statistic
                title="Completed Orders Revenue"
                value={completedRevenue}
                prefix="VND"
                className="text-green-600"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} className="bg-yellow-50 hover:bg-yellow-100 transition" loading={loading}>
              <Statistic
                title="Average Revenue per Completed Order"
                value={bookingData.length > 0 ? (completedRevenue / bookingData.length).toFixed(2) : 0}
                prefix="VND"
                className="text-yellow-600"
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Revenue by Day of the Week" loading={loading}>
              <Line {...revenueLineConfig} height={400} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-6">
          <Col span={24}>
            <Card title="Completed Orders by Day of the Week" loading={loading}>
              <Line {...countLineConfig} height={400} />
            </Card>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Chart;

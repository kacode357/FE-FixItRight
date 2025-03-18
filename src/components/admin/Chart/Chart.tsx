import { useState, useEffect } from "react";
import { Layout, Row, Col } from "antd";
import { bookingService } from "../../../services/bookingService";
import CompletedOrdersRevenue from "./CompletedOrdersRevenue";
import AverageRevenuePerOrder from "./AverageRevenuePerOrder";
import RevenueByDay from "./RevenueByDay";
import CompletedOrdersByDay from "./CompletedOrdersByDay";

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

  return (
    <>
      <Header className="bg-white p-4">
        <h1 className="text-2xl font-bold">Weekly Completed Bookings Statistics</h1>
      </Header>
      <Content className="p-6 bg-white rounded-lg">
        <Row gutter={[16, 16]} className="mb-6">
          <Col span={12}>
            <CompletedOrdersRevenue completedRevenue={completedRevenue} loading={loading} />
          </Col>
          <Col span={12}>
            <AverageRevenuePerOrder
              completedRevenue={completedRevenue}
              totalOrders={bookingData.length}
              loading={loading}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <RevenueByDay weeklyData={weeklyData} loading={loading} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mt-6">
          <Col span={24}>
            <CompletedOrdersByDay weeklyData={weeklyData} loading={loading} />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Chart;

import { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Statistic } from "antd";
import { bookingService } from "../../../services/bookingService";
import RevenueByDay from "./RevenueByDay";
import CompletedOrdersByDay from "./CompletedOrdersByDay";
import { GetAllUsers } from "../../../services/api";
import BookingStatusFilter from "./BookingStatusFilter"; 

const { Header, Content } = Layout;

const Chart = () => {
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; revenue: number; count: number }[]>([]);
  const [completedRevenue, setCompletedRevenue] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Thêm state lỗi

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const completedBookings: Booking[] = await bookingService.getAllBookings("Completed", 1, 1000);
        console.log("Completed Bookings:", completedBookings);
        if (!completedBookings || completedBookings.length === 0) {
          setError("No completed bookings found.");
        }
        setBookingData(completedBookings || []);

        const completedRev = completedBookings.reduce((sum, booking) => {
          return sum + (booking?.Service?.Price || 0);
        }, 0);
        console.log("Completed Revenue:", completedRev);
        setCompletedRevenue(completedRev);

        const dayRevenueMap: { [key: string]: { revenue: number; count: number } } = {};
        (completedBookings || []).forEach((booking) => {
          const date = new Date(booking.WorkingDate);
          const day = date.toLocaleString("en-US", { weekday: "long" });
          if (!dayRevenueMap[day]) {
            dayRevenueMap[day] = { revenue: 0, count: 0 };
          }
          dayRevenueMap[day].revenue += booking?.Service?.Price || 0;
          dayRevenueMap[day].count += 1;
        });

        const weekly = Object.entries(dayRevenueMap).map(([day, { revenue, count }]) => ({
          day,
          revenue,
          count,
        }));
        setWeeklyData(weekly);

        const usersResponse = await GetAllUsers({
          Active: true,
          IsVerified: true,
          PageNumber: 1,
          PageSize: 1000,
        });
        setTotalUsers(usersResponse?.Data?.length || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header className="bg-white p-4">
        <h1 className="text-2xl font-bold">Application Statistics</h1>
      </Header>
      <Content className="p-6 bg-white rounded-lg">
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
        
        {/* BookingStatusFilter Component added here */}
        <BookingStatusFilter />
        
        <Row gutter={[16, 16]} className="mb-6">
          <Col span={8}>
            <Card loading={loading}>
              <Statistic
                title="Total Revenue (VND)"
                value={completedRevenue}
                precision={2}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card loading={loading}>
              <Statistic
                title="Total Completed Bookings"
                value={bookingData.length}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card loading={loading}>
              <Statistic title="Total Users" value={totalUsers} valueStyle={{ color: "#faad14" }} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <RevenueByDay weeklyData={weeklyData} loading={loading} />
          </Col>
          <Col span={12}>
            <CompletedOrdersByDay weeklyData={weeklyData} loading={loading} />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Chart;

import { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Statistic } from "antd";
import { bookingService } from "../../../services/bookingService";
import RevenueByDay from "./RevenueByDay";
import CompletedOrdersByDay from "./CompletedOrdersByDay";
import { getTotalUsers } from "../../../services/api";
import { transactionService } from "../../../services/transactionService";
import MonthlyRevenueChart from "./MonthlyRevenueChart";
import MonthlyOrdersChart from "./MonthlyOrdersChart";

const { Header, Content } = Layout;

const Chart = () => {
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ day: string; revenue: number; count: number }[]>([]);
  const [completedRevenue, setCompletedRevenue] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [totalTransactionMoney, setTotalTransactionMoney] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy danh sách booking (không lọc status)
        const { Data: bookings } = await bookingService.getAllBookings("Completed", 1, 1000);
        setBookingData(bookings || []);

        // Tính tổng doanh thu
        const totalRevenue = bookings.reduce((sum: number, booking: Booking) => {
          return sum + (booking?.Service?.Price || 0);
        }, 0);
        setCompletedRevenue(totalRevenue);

        // Tính revenue + số đơn theo thứ trong tuần
        const dayRevenueMap: { [key: string]: { revenue: number; count: number } } = {};
        bookings.forEach((booking: Booking) => {
          const date: Date = new Date(booking.WorkingDate);
          const day: string = date.toLocaleString("en-US", { weekday: "long" });

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

        // Tổng user
        const { data } = await getTotalUsers();
        setTotalUsers(data);

        // Tổng số giao dịch & tổng tiền giao dịch
        const totalTrans = await transactionService.getTotalTransactions();
        setTotalTransactions(totalTrans.data);

        const totalMoney = await transactionService.getTotalMoney();
        setTotalTransactionMoney(totalMoney.data);
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
              <Statistic title="Total completed booking" value={bookingData.length} valueStyle={{ color: "#3f8600" }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card loading={loading}>
              <Statistic title="Total Users" value={totalUsers} valueStyle={{ color: "#faad14" }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card loading={loading}>
              <Statistic title="Total Transactions" value={totalTransactions} valueStyle={{ color: "#722ed1" }} />
            </Card>
          </Col>
          <Col span={8}>
            <Card loading={loading}>
              <Statistic
                title="Total Transaction Amount (VND)"
                value={totalTransactionMoney}
                precision={0}
                valueStyle={{ color: "#d4380d" }}
              />
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
          <Col span={12}>
            <MonthlyRevenueChart />
          </Col>
          <Col span={12}>
            <MonthlyOrdersChart />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Chart;

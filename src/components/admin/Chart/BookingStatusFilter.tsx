import React, { useState, useEffect } from "react";
import { Select, Row, Col, Card, Statistic, Spin } from "antd";
import { bookingService } from "../../../services/bookingService";

const { Option } = Select;

const BookingStatusFilter: React.FC = () => {
  const [status, setStatus] = useState<string>("completed"); 
  const [bookingData, setBookingData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookings = await bookingService.getAllBookings(status, 1, 1000);
        setBookingData(bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [status]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  return (
    <Card title="Booking Status Filter" bordered={false} className="p-4">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Select
            defaultValue={status}
            style={{ width: "100%" }}
            onChange={handleStatusChange}
            loading={loading}
          >
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Accepted">Accepted</Option>
          </Select>
        </Col>

        <Col span={12}>
          <Statistic
            title="Total Bookings"
            value={bookingData.length}
            suffix="Bookings"
            loading={loading}
            style={{ fontSize: "16px" }}
          />
        </Col>
      </Row>

      {loading ? (
        <Spin size="large" style={{ display: "block", marginTop: 16 }} />
      ) : error ? (
        <div style={{ color: "red", marginTop: 16 }}>{error}</div>
      ) : (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {bookingData.map((booking) => (
            <Col span={8} key={booking.Id}>
              <Card title={`Booking ID: ${booking.Id}`} bordered={false}>
                <Statistic
                  title="Service"
                  value={booking.Service?.Name}
                  style={{ fontSize: "14px" }}
                />
                <Statistic
                  title="Revenue"
                  value={booking.Service?.Price}
                  suffix="VND"
                  style={{ fontSize: "14px" }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
};

export default BookingStatusFilter;

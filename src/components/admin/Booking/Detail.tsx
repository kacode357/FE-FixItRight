import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message, Spin } from "antd";
import { bookingService } from "../../../services/bookingService";

interface DetailBookingProps {
  visible: boolean;
  bookingId: string;
  onClose: () => void;
  refreshBookings: () => void;
}

const DetailBooking: React.FC<DetailBookingProps> = ({ visible, bookingId, onClose, refreshBookings }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && bookingId) {
      setLoading(true);
      setError(null);
      form.resetFields();
      console.log("Fetching booking with ID:", bookingId); // Debug log
      bookingService
        .getBookingById(bookingId)
        .then((data) => {
          if (!data || typeof data !== "object" || !data.Id) {
            throw new Error("Dữ liệu đặt chỗ không hợp lệ từ API");
          }
          setBooking(data);
          form.setFieldsValue({
            id: data.Id || "",
            customerId: data.CustomerId || "",
            mechanistId: data.MechanistId || "",
            serviceId: data.ServiceId || "",
            image: data.Service?.Image || "",
            name: data.Service?.Name || "",
            description: data.Service?.Description || "",
            price: data.Service?.Price || 0,
            category: data.Service?.Category?.Name || "",
            rating: data.Rating || 0,
            workingDate: data.WorkingDate || "",
            address: data.Address || "",
            progressTime: data.ProgressTime || "",
            status: data.Status || "",
            bookingDate: data.BookingDate || "",
            note: data.Note || "",
          });
        })
        .catch((err) => {
          const errorMessage = err.response?.data?.Message || err.message || "Không thể tải chi tiết đặt chỗ";
          message.error(errorMessage);
          setError(errorMessage);
          setBooking(null);
        })
        .finally(() => setLoading(false));
    } else {
      form.resetFields();
      setBooking(null);
      setError(null);
    }
  }, [visible, bookingId, form]);

  const handleClose = () => {
    onClose();
    setError(null);
  };

  return (
    <Modal
      title="Chi tiết đặt chỗ"
      open={visible}
      onCancel={handleClose}
      footer={[
        <Button key="close" type="primary" onClick={handleClose}>
          Đóng
        </Button>,
      ]}
      centered
    >
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div style={{ color: "red" }}>Lỗi: {error}</div>
      ) : booking ? (
        <Form form={form} layout="vertical" disabled={true}>
          <Form.Item label="ID" name="id">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="ID khách hàng" name="customerId">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="ID thợ máy" name="mechanistId">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="ID dịch vụ" name="serviceId">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Hình ảnh" name="image">
            <Input
              readOnly
              addonAfter={
                <img
                  src={form.getFieldValue("image") || "https://via.placeholder.com/50"}
                  alt="Booking"
                  style={{ width: 50 }}
                />
              }
            />
          </Form.Item>
          <Form.Item label="Tên dịch vụ" name="name">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea readOnly />
          </Form.Item>
          <Form.Item label="Giá" name="price">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Danh mục" name="category">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Đánh giá" name="rating">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Ngày làm việc" name="workingDate">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Thời gian xử lý" name="progressTime">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Ngày đặt chỗ" name="bookingDate">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea readOnly />
          </Form.Item>
        </Form>
      ) : null}
    </Modal>
  );
};

export default DetailBooking;

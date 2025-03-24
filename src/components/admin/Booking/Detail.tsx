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
    const fetchData = async () => {
      if (visible && bookingId) {
        setLoading(true);
        setError(null);
        try {
          const data = await bookingService.getBookingById(bookingId);
          setBooking(data);

          if (data && data.Id) {
            setBooking(data);

            form.setFieldsValue({
              id: data.Id,
              customerId: data.CustomerId,
              mechanistId: data.MechanistId,
              serviceId: data.ServiceId,
              image: data.Service?.Image,
              name: data.Service?.Name,
              description: data.Service?.Description,
              price: data.Service?.Price,
              category: data.Service?.Category?.Name,
              rating: data.Rating,
              workingDate: data.WorkingDate,
              address: data.Address,
              progressTime: data.ProgressTime,
              status: data.Status,
              bookingDate: data.BookingDate,
              note: data.Note,
            });
          } else {
            throw new Error("Không tìm thấy dữ liệu đặt chỗ hoặc dữ liệu sai cấu trúc");
          }
        } catch (err: any) {
          message.error("Không thể lấy chi tiết đặt chỗ");
          setError(err.message || "Lỗi không xác định");
          setBooking(null);
        } finally {
          setLoading(false);
        }
      } else {
        form.resetFields();
        setBooking(null);
        setError(null);
      }
    };

    fetchData();
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

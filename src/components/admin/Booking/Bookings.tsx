import { useCallback, useEffect, useState } from "react";
import { Table, Input, Button, Spin, message, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { bookingService } from "../../../services/bookingService";
import DetailBooking from "./Detail";
import dayjs from "dayjs";

const { Search } = Input;

const Bookings = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookingService.getAllBookings(statusFilter, pageNumber, pageSize);
      console.log("Fetched bookings:", response);
      setData(Array.isArray(response.Data) ? response.Data : []);
      setMetaData(response.MetaData); // ← lưu lại phân trang

      const uniqueCategories = Array.from(
        new Set(response.Data.filter((b: Booking) => b?.Service?.Category).map((b: Booking) => b.Service.Category))
      );
      setCategories(uniqueCategories as Category[]);
    } catch (error: any) {
      message.error("Không thể lấy danh sách đặt lịch");
      setError(error.message || "Lỗi không xác định");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, pageNumber, pageSize]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredData = data
    ? data.filter((booking) => {
        const name = booking.Service.Name || "";
        const description = booking.Service.Description || "";
        const matchesSearch =
          name.toLowerCase().includes(searchText.toLowerCase()) ||
          description.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = booking.Status === statusFilter;
        const matchesCategory =
          !categoryFilter || (booking.Service.Category && booking.Service.Category.Name === categoryFilter);

        return matchesSearch && matchesStatus && matchesCategory;
      })
    : [];

  const handleDetail = (id: string) => {
    setSelectedBookingId(id);
    setIsDetailModalVisible(true);
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_: any, __: any, index: number) => (pageNumber - 1) * pageSize + index + 1,
    },
    {
      title: "Booking ID",
      dataIndex: "Id",
      key: "BookingId",
    },
    {
      title: "Image",
      dataIndex: ["Service", "Image"],
      key: "Image",
      render: (text: string) => <img src={text} alt="Booking" style={{ width: 50 }} />,
    },
    {
      title: "Name",
      dataIndex: ["Service", "Name"],
      key: "Name",
    },
    {
      title: "Description",
      dataIndex: ["Service", "Description"],
      key: "Description",
    },
    {
      title: "Price",
      dataIndex: ["Service", "Price"],
      key: "Price",
      render: (price: number) => (price ? price.toLocaleString("vi-VN") + " ₫" : "0 ₫"),
    },
    {
      title: "Category",
      dataIndex: ["Service", "Category", "Name"],
      key: "Category",
    },
    { title: "Status", dataIndex: "Status", key: "Status" },
    {
      title: "Booking Date",
      dataIndex: "BookingDate",
      key: "BookingDate",
      render: (date: string) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Booking) => (
        <div className="flex space-x-2">
          <Tooltip title="Chi tiết">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleDetail(record.Id)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ position: "relative", left: 0 }}>
      <div className="mb-4 flex justify-between items-center">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Search
            placeholder="Tìm kiếm theo tên hoặc mô tả"
            allowClear
            onSearch={handleSearch}
            enterButton
            style={{ width: "300px" }}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "5px" }}>
            <option value="Pending">Chờ xử lý</option>
            <option value="Accepted">Đã chấp nhận</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Cancelled">Đã hủy</option>
          </select>
          <select
            value={categoryFilter || ""}
            onChange={(e) => setCategoryFilter(e.target.value || null)}
            style={{ padding: "5px" }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.Id} value={category.Name}>
                {category.Name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div style={{ color: "red" }}>Lỗi: {error}</div>
      ) : data.length === 0 ? (
        <div>Không có đặt chỗ nào</div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="Id"
          pagination={{
            current: metaData?.CurrentPage || 1,
            pageSize: metaData?.PageSize || 20,
            total: metaData?.TotalCount || 0,
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size || 20);
            },
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      )}
      {selectedBookingId && (
        <DetailBooking
          key={selectedBookingId} // Force remount when bookingId changes
          visible={isDetailModalVisible}
          bookingId={selectedBookingId}
          onClose={() => setIsDetailModalVisible(false)}
          refreshBookings={fetchBookings}
        />
      )}
    </div>
  );
};

export default Bookings;

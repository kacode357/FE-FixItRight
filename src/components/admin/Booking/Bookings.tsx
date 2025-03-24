import { useEffect, useState } from "react";
import { Table, Input, Button, Spin, message, Tooltip } from "antd";
import { DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import { bookingService } from "../../../services/bookingService";
import DetailBooking from "./Detail";

const { Search } = Input;

const Bookings = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const bookings = await bookingService.getAllBookings(statusFilter, pageNumber, pageSize);
      console.log("Fetched bookings:", bookings);
      setData(Array.isArray(bookings) ? bookings : []);

      const uniqueCategories = Array.from(
        new Set(
          bookings
            .filter((b: Booking) => b !== undefined && b.Service?.Category !== undefined)
            .map((booking: Booking) => booking.Service.Category)
        )
      );
      setCategories(uniqueCategories as Category[]);
    } catch (error: any) {
      message.error("Không thể lấy danh sách đặt chỗ");
      setError(error.message || "Lỗi không xác định");
      setData([]);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, pageNumber, pageSize]);

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
    console.log("Opening detail for ID:", id); // Debug log
    setSelectedBookingId(id);
    setIsDetailModalVisible(true);
  };

  const columns = [
    { title: "ID", dataIndex: "Id", key: "Id" },
    { title: "Customer ID", dataIndex: "CustomerId", key: "CustomerId" },
    { title: "Mechanist ID", dataIndex: "MechanistId", key: "MechanistId" },
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
    },
    {
      title: "Category",
      dataIndex: ["Service", "Category", "Name"],
      key: "Category",
    },
    { title: "Status", dataIndex: "Status", key: "Status" },
    { title: "Booking Date", dataIndex: "BookingDate", key: "BookingDate" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Booking) => (
        <div className="flex space-x-2">
          <Tooltip title="Chi tiết">
            <Button type="link" icon={<EyeOutlined />} onClick={() => handleDetail(record.Id)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="link" danger icon={<DeleteOutlined />} />
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
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm đặt chỗ
        </Button>
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
            current: pageNumber,
            pageSize: pageSize,
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size || 20);
            },
          }}
          className="mb-4"
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

import { useEffect, useState } from "react";
import { Table, Input, Button, Spin, message, Tooltip, Tag } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { transactionService } from "../../../services/transactionService";
import dayjs from "dayjs";

const { Search } = Input;

type Transaction = {
  Id: string;
  Amount: number;
  CreatedAt: string;
  BookingId: string;
  Status: string;
  UserId: string;
};

const Transaction = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Lấy toàn bộ dữ liệu
      const { data: transactions } = await transactionService.getTransactions(1, 1000);
      setData(transactions ?? []);
    } catch (error: any) {
      message.error("Không thể lấy danh sách giao dịch");
      setError(error.message || "Lỗi không xác định");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value.trim().toLowerCase());
  };

  const filteredData = data.filter((item) => {
    const search = searchText.trim().toLowerCase();
    if (!search) return true;

    return (
      (item.UserId?.toLowerCase() ?? "").includes(search) ||
      (item.BookingId?.toLowerCase() ?? "").includes(search) ||
      (item.Id?.toLowerCase() ?? "").includes(search)
    );
  });

  useEffect(() => {
    console.log("➡️ Raw data from API:", data);
  }, [data]);

  useEffect(() => {
    console.log("🔍 Search text:", searchText);
    console.log("✅ Filtered data:", filteredData);
  }, [searchText, filteredData]);

  const columns = [
    { title: "ID", dataIndex: "Id", key: "Id" },
    { title: "User ID", dataIndex: "UserId", key: "UserId" },
    { title: "Booking ID", dataIndex: "BookingId", key: "BookingId" },
    {
      title: "Số tiền",
      dataIndex: "Amount",
      key: "Amount",
      render: (amount: number) => amount.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Thời gian",
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      render: (status: string) => {
        const color = status === "Success" ? "green" : status === "Pending" ? "orange" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Transaction) => (
        <Tooltip title="Chi tiết">
          <Button type="link" icon={<EyeFilled />} onClick={() => console.log("Chi tiết:", record)} />
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Search
            placeholder="Tìm theo ID, User ID hoặc Booking ID"
            allowClear
            onSearch={handleSearch}
            enterButton
            style={{ width: 300 }}
          />
        </div>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div style={{ color: "red" }}>Lỗi: {error}</div>
      ) : filteredData.length === 0 ? (
        <div>Không có giao dịch nào phù hợp</div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="Id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      )}
    </div>
  );
};

export default Transaction;

import { useCallback, useEffect, useState } from "react";
import { Table, Input, Spin, message, Tag } from "antd";
import { transactionService } from "../../../services/transactionService";
import dayjs from "dayjs";

const { Search } = Input;

const Transaction = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await transactionService.getTransactions(pageNumber, pageSize);
      setData(res.Data ?? []);
      setMetaData(res.MetaData);
    } catch (error: any) {
      message.error("Không thể lấy danh sách giao dịch");
      setError(error.message || "Lỗi không xác định");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearch = (value: string) => {
    setSearchText(value.trim().toLowerCase());
  };

  const filteredData = data.filter((item) => {
    const search = searchText.trim().toLowerCase();
    if (!search) return true;

    return (item.UserId?.toLowerCase() ?? "").includes(search) || (item.Id?.toLowerCase() ?? "").includes(search);
  });

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_: any, __: any, index: number) => (pageNumber - 1) * pageSize + index + 1,
    },
    { title: "ID", dataIndex: "Id", key: "Id" },
    { title: "User ID", dataIndex: "UserId", key: "UserId" },
    {
      title: "Price",
      dataIndex: "Amount",
      key: "Amount",
      render: (amount: number) => amount.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Time",
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status: string) => {
        const color = status === "Success" ? "green" : status === "Pending" ? "orange" : "default";
        return <Tag color={color}>{status}</Tag>;
      },
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
            current: metaData?.CurrentPage || pageNumber,
            pageSize: metaData?.PageSize || pageSize,
            total: metaData?.TotalCount || 0,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size || 20);
            },
          }}
        />
      )}
    </div>
  );
};

export default Transaction;

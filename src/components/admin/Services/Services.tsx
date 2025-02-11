import { useEffect, useState } from "react";
import { Table, Pagination, Input, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { GetAllRepairServices } from "../../../services/api";
import AddServices from "./AddServices"; // Import AddServices component
import EditService from "./EditService"; // Import EditService component
import DeleteService from "./DeleteService"; // Import DeleteService component

const { Search } = Input;

const Services = () => {
  interface Service {
    Id: string;
    Name: string;
    Description: string;
    Price: number;
    Image: string;
  }

  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [searchName, setSearchName] = useState<string>("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const fetchServices = async (page: number, size: number, name: string) => {
    setLoading(true);
    try {
      const response = await GetAllRepairServices({
        PageNumber: page,
        PageSize: size,
        SearchName: name,
      });
      setData(response.Data || []);
      setTotalCount(response.MetaData.TotalCount);
    } catch (error) {
      console.error("Failed to fetch repair services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage, pageSize, searchName);
  }, [currentPage, pageSize, searchName]);

  const ResetSerVices = () => {
    fetchServices(currentPage, pageSize, searchName);
  };

  const handleEdit = (id: string) => {
    setSelectedServiceId(id);
    setEditModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setSelectedServiceId(id);
    setDeleteModalVisible(true);
  };

  const columns = [
    {
      title: "Service Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Image",
      dataIndex: "Image",
      key: "Image",
      render: (image: string) => (
        <img src={image} alt="Service" className="w-12 h-12 object-cover" />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Service) => (
        <div className="flex space-x-2">
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.Id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.Id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchName(value);
    setCurrentPage(1);
  };

  return (
    <div style={{ position: "relative",  left: 0 }}>
      <div className="mb-4 flex justify-between">
        <Search
          placeholder="Search by service name"
          allowClear
          onSearch={handleSearch}
          enterButton
          style={{ width: "300px" }}
        />
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          Add Service
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.Id}
        loading={loading}
        pagination={false}
        className="mb-4"
      />
      <div className="flex justify-end">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalCount}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
        />
      </div>
      <AddServices
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        ResetSerVices={ResetSerVices}
      />
      {selectedServiceId && (
        <EditService
          visible={editModalVisible}
          serviceId={selectedServiceId}
          onClose={() => setEditModalVisible(false)}
          onSave={ResetSerVices}
          ResetSerVices={ResetSerVices}
        />
      )}
      {selectedServiceId && (
        <DeleteService
          visible={deleteModalVisible}
          serviceId={selectedServiceId}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={ResetSerVices}
          ResetSerVices={ResetSerVices}
        />
      )}
    </div>
  );
};

export default Services;

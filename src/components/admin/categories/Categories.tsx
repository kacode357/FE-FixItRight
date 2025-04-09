import { useEffect, useState } from "react";
import { Table, Input, Button, Spin, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { categoryService } from "../../../services/categoryService";
import EditCategory from "./EditCategory";
import AddCategoryModal from "./AddCategory";
import DeleteCategory from "./DeleteCategory"; // Import component DeleteCategory

const { Search } = Input;

const Categories = () => {
  interface Category {
    Id: string;
    Name: string;
  }

  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State cho modal xóa
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categories = await categoryService.getAllCategories();
      setData(categories || []);
    } catch (error) {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleAddCategory = () => {
    setIsAddModalVisible(true);
  };

  const handleEditCategory = (id: string) => {
    setSelectedCategoryId(id);
    setIsEditModalVisible(true);
  };

  const handleDeleteCategory = (id: string) => {
    setSelectedCategoryId(id);
    setIsDeleteModalVisible(true); // Mở modal xóa
  };

  const handleDeleteConfirm = (id: string) => {
    setData(data.filter((category) => category.Id !== id)); // Cập nhật state sau khi xóa
  };

  const filteredData = data.filter((category) => category.Name.toLowerCase().includes(searchText.toLowerCase()));

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Category Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Category) => (
        <div className="flex space-x-2">
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditCategory(record.Id)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCategory(record.Id)} // Thêm sự kiện xóa
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div style={{ position: "relative", left: 0 }}>
      <div className="mb-4 flex justify-between">
        <Search
          placeholder="Search categories"
          allowClear
          onSearch={handleSearch}
          enterButton
          style={{ width: "300px" }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
          Add Category
        </Button>
      </div>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          rowKey="Id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredData.length,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
          className="mb-4"
        />
      )}
      <AddCategoryModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSuccess={fetchCategories}
      />
      {selectedCategoryId && (
        <EditCategory
          visible={isEditModalVisible}
          categoryId={selectedCategoryId}
          onClose={() => setIsEditModalVisible(false)}
          onSave={() => fetchCategories()}
          refreshCategories={fetchCategories}
        />
      )}
      {selectedCategoryId && (
        <DeleteCategory
          visible={isDeleteModalVisible}
          categoryId={selectedCategoryId}
          onClose={() => setIsDeleteModalVisible(false)}
          onConfirm={handleDeleteConfirm}
          refreshCategories={fetchCategories}
        />
      )}
    </div>
  );
};

export default Categories;

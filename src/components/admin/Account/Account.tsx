import { useEffect, useState } from "react";
import { Table, Button, Input, Select, Row, Col, Tooltip, Switch } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { GetAllUsers } from "../../../services/api";
import EditUser from "./EditAccount";
import AddUser from "./AddAccount";
import ViewAccount from "./ViewAccount";
import debounce from "lodash.debounce";
import deleteAccount from "./DeleteAccount";
import dayjs from "dayjs"; // Thêm thư viện dayjs để format ngày tháng

const { Search } = Input;
const { Option } = Select;

interface User {
  Id: string;
  Avatar: string;
  Fullname: string | null;
  UserName: string;
  PhoneNumber: string | null;
  Address: string | null;
  Gender: string;
  Birthday: string;
  Roles: string[];
  IsVerified: boolean;
  Active: boolean;
}

const Account = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [metaData, setMetaData] = useState<MetaData>({
    TotalPages: 0,
    CurrentPage: 1,
    PageSize: 50,
    TotalCount: 0,
    HasPrevious: false,
    HasNext: false,
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchName, setSearchName] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const fetchUsers = async (page: number = 1, size: number = metaData.PageSize) => {
    try {
      const response = await GetAllUsers({
        Role: roleFilter,
        Active: true,
        IsVerified: false,
        SearchName: searchName,
        PageNumber: page,
        PageSize: size,
      });

      setUsers(response.Data);
      setMetaData(response.MetaData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchName(value || null);
  }, 300);

  const refreshUsers = () => fetchUsers(metaData.CurrentPage);

  useEffect(() => {
    fetchUsers(metaData.CurrentPage);
  }, [searchName, roleFilter]);

  const handleRoleFilterChange = (value: string | undefined) => setRoleFilter(value || null);

  const handleStatusToggle = async (id: string) => {
    await deleteAccount(id, refreshUsers);
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setIsViewModalVisible(true);
  };

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "Avatar",
      key: "avatar",
      render: (avatar: string) => (
        <img src={avatar} alt="Avatar" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} />
      ),
    },
    {
      title: "Full Name",
      dataIndex: "Fullname",
      key: "fullname",
      render: (fullname: string | null) => fullname || "N/A",
    },
    {
      title: "Username",
      dataIndex: "UserName",
      key: "userName",
    },
    {
      title: "Phone",
      dataIndex: "PhoneNumber",
      key: "phoneNumber",
      render: (phone: string | null) => phone || "-",
    },
    {
      title: "Address",
      dataIndex: "Address",
      key: "address",
      render: (address: string | null) => address || "-",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "gender",
    },
    {
      title: "Birthday",
      dataIndex: "Birthday",
      key: "birthday",
      render: (birthday: string) => (birthday === "0001-01-01" ? "N/A" : dayjs(birthday).format("DD/MM/YYYY")),
    },
    {
      title: "Roles",
      dataIndex: "Roles",
      key: "roles",
      render: (roles: string[]) => roles.join(", "),
    },
    {
      title: "Status",
      dataIndex: "Active",
      key: "active",
      render: (active: boolean, record: User) => (
        <Switch checked={active} onChange={() => handleStatusToggle(record.Id)} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: User) => (
        <>
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => handleViewUser(record.Id)} type="text" />
          </Tooltip>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => handleEditUser(record.Id)} type="text" />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div style={{ position: "relative", left: 0 }}>
      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col span={6}>
          <Search placeholder="Search by name" onSearch={debouncedSearch} enterButton allowClear />
        </Col>
        <Col span={10}>
          <Select placeholder="Filter by role" style={{ width: 130 }} onChange={handleRoleFilterChange} allowClear>
            {["Admin", "Customer", "Mechanist"].map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
            Add User
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record.Id}
        pagination={{
          current: metaData.CurrentPage,
          pageSize: metaData.PageSize,
          total: metaData.TotalCount,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15", "20", "50"],
        }}
        onChange={(pagination) => {
          const { current = 1, pageSize: newSize = metaData.PageSize } = pagination;
          fetchUsers(current, newSize);
        }}
      />

      {selectedUserId && (
        <ViewAccount
          userId={selectedUserId}
          visible={isViewModalVisible}
          onClose={() => setIsViewModalVisible(false)}
        />
      )}
      <AddUser
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        refreshUsers={refreshUsers}
        onAddUser={(values) => console.log(values)}
      />
      {selectedUserId && (
        <EditUser
          userId={selectedUserId}
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          refreshUsers={refreshUsers}
        />
      )}
    </div>
  );
};

export default Account;

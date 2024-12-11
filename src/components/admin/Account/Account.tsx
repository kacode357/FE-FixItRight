import { useEffect, useState } from "react";
import { Tabs, Table, Switch, Button, Input, Select, Row, Col, Tooltip } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { GetAllUsers } from "../../../services/api";
import EditUser from "./EditAccount";
import AddUser from "./AddAccount";
import ViewAccount from "./ViewAccount";
import debounce from "lodash.debounce";
import deleteAccount from "./DeleteAccount";

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface User {
  Id: string;
  avatar: string;
  fullname: string;
  userName: string;
  phoneNumber: string;
  isVerified: boolean;
  active: boolean;
}

interface MetaData {
  TotalPages: number;
  CurrentPage: number;
}

const Account = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [metaData, setMetaData] = useState<MetaData>({ TotalPages: 0, CurrentPage: 1 });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchName, setSearchName] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("active");

  const fetchUsers = debounce(async (page: number = 1) => {
    try {
      const response = await GetAllUsers({
        Role: roleFilter,
        Active: activeTab === "active",
        IsVerified: false,
        SearchName: searchName,
        PageNumber: page,
        PageSize: 5,
      });
      setUsers(response.Data);
      setMetaData(response.MetaData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, 0);

  const refreshUsers = () => fetchUsers(metaData.CurrentPage);

  useEffect(() => {
    fetchUsers(metaData.CurrentPage);
  }, [searchName, roleFilter, activeTab]);

  const handleSearch = (value: string) => setSearchName(value || null);
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
        <img src={avatar} alt="Avatar" style={{ width: 50, height: 50, borderRadius: "50%" }} />
      ),
    },
    { title: "Full Name", dataIndex: "Fullname", key: "fullname" },
    { title: "Username", dataIndex: "UserName", key: "userName" },
    { title: "Phone Number", dataIndex: "PhoneNumber", key: "phoneNumber" },
    activeTab === "active"
      ? {
          title: "Status",
          dataIndex: "Active",
          key: "active",
          render: (active: boolean, record: User) => (
            <Switch checked={active} onChange={() => handleStatusToggle(record.Id)} />
          ),
        }
      : {
          title: "Status",
          dataIndex: "Active",
          key: "active",
          render: (active: boolean) => (active ? "Active" : "Inactive"),
        },
    {
      title: "Verification",
      dataIndex: "IsVerified",
      key: "isVerified",
      render: (isVerified: boolean) => (isVerified ? "Verified" : "Not Verified"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: User) => (
        <>
          <Tooltip title="View">
            <Button icon={<EyeOutlined />} onClick={() => handleViewUser(record.Id)} type="text" />
          </Tooltip>
          {activeTab === "active" && (
            <Tooltip title="Edit">
              <Button icon={<EditOutlined />} onClick={() => handleEditUser(record.Id)} type="text" />
            </Tooltip>
          )}
        </>
      ),
    },
  ];
  

  return (
    <div style={{ position: "relative", top: -70, left: 0 }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {["active", "inactive"].map((key) => (
          <TabPane tab={key.charAt(0).toUpperCase() + key.slice(1)} key={key}>
            <Row gutter={16} style={{ marginBottom: 10 }}>
              <Col span={6}>
                <Search placeholder="Search by name" onSearch={handleSearch} enterButton allowClear />
              </Col>
              <Col span={10}>
                <Select
                  placeholder="Filter by role"
                  style={{ width: 130 }}
                  onChange={handleRoleFilterChange}
                  allowClear
                >
                  {["Admin", "Customer", "Mechanist"].map((role) => (
                    <Option key={role} value={role}>{role}</Option>
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
                pageSize: 5,
                total: metaData.TotalPages * 5,
                showSizeChanger: false,
              }}
              onChange={(pagination) => fetchUsers(pagination.current || 1)}
            />
          </TabPane>
        ))}
      </Tabs>
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
        onAddUser={() => { refreshUsers();
        }}
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
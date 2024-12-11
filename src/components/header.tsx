import React, { useContext } from "react";
import { Layout, Avatar, Dropdown, MenuProps, Button, Badge } from "antd";
import { BellOutlined, DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

const { Header } = Layout;

interface AppHeaderProps {
  loading: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ loading }) => {
  const { auth, appLoading } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const avatarMenuItems: MenuProps["items"] = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <Link to="/my-profile">My Profile</Link>,
    },
    {
      key: "2",
      icon: <LogoutOutlined />,
      label: (
        <a onClick={handleLogout} style={{ display: "flex", alignItems: "center" }}>
          Logout
        </a>
      ),
    },
  ];

  // Nếu isLoading, chỉ hiển thị Skeleton
  if (loading || appLoading) {
    return (
      <Header
        className="header flex justify-between items-center"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          height: "80px",
          padding: "0 20px",
        }}
      >
      
      </Header>
    );
  }

  return (
    <Header
      className="header flex justify-between items-center"
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        height: "80px",
        padding: "0 20px",
      }}
    >
      <>
        <div className="flex-1 flex justify-start"></div>
        <div className="flex-1 flex justify-center"></div>
        <div className="flex-1 flex justify-end items-center">
          <Badge
            offset={[10, 0]}
            style={{
              backgroundColor: "#E8E8E8",
              height: "60px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Avatar
              icon={<BellOutlined />}
              shape="square"
              size={55}
              style={{
                backgroundColor: "#f3f6f4",
                color: "black",
                marginRight: "20px",
              }}
            />
          </Badge>
          {auth.isAuthenticated ? (
            <Dropdown menu={{ items: avatarMenuItems }} trigger={["hover"]} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "60px",
                  padding: "2px 7px",
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#FFFFFF",
                  overflow: "hidden",
                }}
              >
                <Avatar
                  src={auth.user.imgUrl}
                  size={40}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "white",
                  }}
                />
                <div
                  style={{
                    marginLeft: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      color: "black",
                      lineHeight: "20px",
                    }}
                  >
                    {auth.user.name}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#9E9E9E",
                      lineHeight: "20px",
                    }}
                  >
                    {auth.user.role}
                  </div>
                </div>
                <DownOutlined style={{ marginLeft: "15px", fontSize: "12px", color: "#000000" }} />
              </div>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          )}
        </div>
      </>
    </Header>
  );
};

export default AppHeader;

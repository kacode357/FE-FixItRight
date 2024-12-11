import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo-sidebar-1.png';
import logoCollapsed from '../assets/logo-sidebar-2.png';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
}

const menuConfig = [
  { path: '/admin/manage-account', icon: <HomeOutlined />, label: 'Account' },
  { path: '/admin/my-profile', icon: <UserOutlined />, label: 'My Profile' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const location = useLocation();

  const sidebarMenu = menuConfig.map((item) => ({
    key: item.path,
    icon: item.icon,
    label: <Link to={item.path}>{item.label}</Link>,
  }));

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width="200"
      style={{
        background: 'linear-gradient(to bottom, #4A628A, #DFF2EB)',
      
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        overflow: 'auto',
      }}
    >
      <div
        className="sidebar-logo"
        style={{
          height: '64px',
          margin: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={collapsed ? logoCollapsed : logo}
          alt="Logo"
          style={{ maxHeight: '100%', maxWidth: '100%' }}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        items={sidebarMenu}
        style={{
          background: 'transparent',
          color: '#FFFFFF',
          fontSize: '14px',
        }}
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
      />
    </Sider>
  );
};
export default Sidebar;
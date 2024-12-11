import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/header';
import Sidebar from '../components/Sidebar';
import Loading from '../components/Loading';
import { setGlobalLoadingHandler } from '../utils/axios.customize';

const { Content } = Layout;

const SidebarLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Register global loading handler on mount
  useEffect(() => {
    setGlobalLoadingHandler(setIsLoading);
   
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200, // Adjust margin dynamically
          transition: 'margin-left 0.2s ease-in-out', // Smooth transition
        }}
      >
        {/* Header */}
        <AppHeader loading={isLoading} />

        {/* Main Content */}
        <Content
          style={{
            padding: '24px',
            background: '#fff',
        
          }}
        >
          {/* Wrap Outlet with Loading */}
          <Loading isLoading={isLoading}>
            <Outlet />
          </Loading>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;

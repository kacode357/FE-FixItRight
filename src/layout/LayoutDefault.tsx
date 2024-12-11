import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/header";

import Loading from "../components/Loading";
import { setGlobalLoadingHandler } from "../utils/axios.customize";

const { Content } = Layout;

const SidebarLayout: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  setGlobalLoadingHandler(setIsLoading);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        {/* Header */}
        <AppHeader loading={false} />

        {/* Nội dung chính */}
        <Content style={{ padding: "24px", background: "#fff" }}>
          {/* Chỉ loading phần Outlet */}
          <Loading isLoading={isLoading}>
            <Outlet />
          </Loading>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;

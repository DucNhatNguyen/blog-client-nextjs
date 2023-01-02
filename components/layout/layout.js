import React from "react";

import { Layout, Menu, theme, Button } from "antd";
import Link from "next/link";
import {
  AppstoreOutlined,
  DashboardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../BreadCrums";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    label: <Link href="/Blog">Submenu 1</Link>,
    key: "1",
    icon: <DashboardOutlined />,
  },
  {
    label: <Link href="/menu2">Submenu 2</Link>,
    key: "2",
    icon: <AppstoreOutlined />,
  },
  {
    label: "Navigation Three - Submenu",
    key: "3",
    icon: <SettingOutlined />,
    children: [
      {
        label: <Link href="/menu3/submenu1">Submenu 1</Link>,
        key: "4",
      },
      {
        label: "Option 2",
        key: "5",
      },
    ],
  },
];

const App = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <div>
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["1"]}
            mode="inline"
            theme="dark"
            items={items}
          />
        </div>
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            color: "black",
          }}
        >
          <div
            style={{
              marginLeft: "20px",
              fontWeight: "bolder",
              fontSize: "35px",
            }}
          >
            <p className="header-title">Danh sách Blogs</p>
          </div>
        </Header>
        <BreadCrumb />
        <Content
          style={{
            margin: "0 25px",
            overflow: "initial",
            background: colorBgContainer,
            color: "black",
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;

import React, { useContext } from "react";

import { Layout, Menu, theme } from "antd";
import Link from "next/link";
import {
  TagsOutlined,
  DashboardOutlined,
  SnippetsOutlined,
  BookOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../BreadCrums";
import { AppContext } from "../../context/AppContext";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    label: <Link href="/Dashboard">Dashboard</Link>,
    key: "1",
    icon: <DashboardOutlined />,
  },
  {
    label: <Link href="/Blog">Blogs</Link>,
    key: "6",
    icon: <BookOutlined />,
  },
  {
    label: "Chuyên mục",
    key: "3",
    icon: <SnippetsOutlined />,
    children: [
      {
        label: <Link href="/Category">Quản lý</Link>,
        key: "4",
      },
      {
        label: <Link href="/Category/order">Sắp xếp</Link>,
        key: "5",
      },
    ],
  },
  {
    label: <Link href="/Tag">Tag</Link>,
    key: "2",
    icon: <TagsOutlined />,
  },
];

const App = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { header, setHeader } = useContext(AppContext);

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
            <span className="header-title">{header}</span>
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

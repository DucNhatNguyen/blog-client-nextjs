import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input, Button, Checkbox, message, Form } from "antd";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";

export default function Login() {
  const onFinish = (values) => {
    console.log("submit", values);
  };

  const onFinishFailed = (values) => {
    console.log("submit", values);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          <img
            src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700"
            alt="Login"
          />
        </div>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <p className="form-title">Đăng nhập</p>
          <p></p>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              LOGIN
            </Button>
          </Form.Item>
          <div>
            Chưa có tài khoản!{" "}
            <Link href="/Home/sign-up">
              Đăng ký <ArrowRightOutlined style={{ marginLeft: 10 }} />
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

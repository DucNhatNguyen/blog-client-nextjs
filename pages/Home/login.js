import React, { useContext, useState } from "react";
import { Input, Button, Checkbox, message, Form } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext";
import { setAccessToken } from "../../utils/authority.js";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { isLoginState, setIsLoginState } = useContext(AppContext);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const handleLogin = (values) => {
    console.log("submit", values);
    fetch(`https://blog-nodejs.onrender.com/api/auth/sign-in`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const dt = await res.json();
      console.log("loggginnn", !!dt.data);
      if (!!dt.data) {
        setIsLoginState(true);
        setAccessToken(dt.data.accessToken);
        router.push("/Category");
      } else {
        setIsLoginState(false);
      }
    });
  };

  const handleSignUp = (values) => {
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
        {!isLoginForm ? (
          <Form
            name="login-form"
            initialValues={{ remember: false }}
            onFinish={handleSignUp}
            onFinishFailed={onFinishFailed}
          >
            <p className="form-title">Đăng ký</p>
            <p></p>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
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
                SIGN UP
              </Button>
            </Form.Item>
            <div>
              <a onClick={() => setIsLoginForm(true)}>
                <ArrowLeftOutlined style={{ marginRight: 10 }} /> Đăng nhập
              </a>
            </div>
          </Form>
        ) : (
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            onFinishFailed={onFinishFailed}
          >
            <p className="form-title">Đăng nhập</p>
            <p></p>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
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
              <a onClick={() => setIsLoginForm(false)}>
                Đăng ký <ArrowRightOutlined style={{ marginLeft: 10 }} />
              </a>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}

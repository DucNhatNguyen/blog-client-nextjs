import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Select } from "antd";

export default function Create({
  open,
  onCancel,
  onCreate,
  confirmModalLoading,
}) {
  const [form] = Form.useForm();

  useEffect(() => {}, [form]);

  return (
    <Modal
      open={open}
      title="Tạo mới Metadata"
      okText="Tạo"
      cancelText="Thoát"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      confirmLoading={confirmModalLoading}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        labelCol={{ span: 5 }}
        form={form}
        layout="horizontal"
        name="create_metadata_form"
      >
        <Form.Item
          name="key"
          label="Key"
          rules={[
            {
              required: true,
              message: "Key không được bỏ trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="value"
          label="Value"
          rules={[
            {
              required: true,
              message: "Value không được bỏ trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Description không được bỏ trống!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
}

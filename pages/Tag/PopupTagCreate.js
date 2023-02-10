import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Select } from "antd";

export default function PopupTagCreate({
  open,
  onCancel,
  onCreate,
  confirmModalLoading,
}) {
  const [form] = Form.useForm();
  const [autoSlug, setAutoSlug] = useState("");

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    form.setFieldsValue({ slug: slugify(autoSlug) });
  }, [autoSlug, form]);

  return (
    <Modal
      open={open}
      title="Tạo mới Tag"
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
        labelCol={{ span: 4 }}
        form={form}
        layout="horizontal"
        name="create_tag_form"
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[
            {
              required: true,
              message: "Tiêu đề không được bỏ trống!",
            },
          ]}
        >
          <Input
            onBlur={(e) => {
              setAutoSlug(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            {
              required: true,
              message: "Slug không được bỏ trống!",
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
}

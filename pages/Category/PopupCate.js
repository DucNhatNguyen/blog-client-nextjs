import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Select } from "antd";

export default function PopupCate({
  id,
  open,
  onSubmit,
  onCancel,
  confirmModalLoading,
  parentCates,
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState({});

  useEffect(() => {
    if (id == 0) return;
    fetch(`https://blog-nodejs.onrender.com/api/category/${id}`).then(
      async (res) => {
        const da = await res.json();
        console.log("data", da);
        form.setFieldsValue({ ...da });
        setData(da);
      }
    ); 
  }, [form, id]);

  return (
    <Modal
      open={open}
      title="Chỉnh sửa Chuyên mục"
      okText="Cập nhật"
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
            onSubmit(values, data.id);
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
        name="edit_cate_form"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Tiêu đề không được bỏ trống!",
            },
          ]}
        >
          <Input />
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
          <Input />
        </Form.Item>

        <Form.Item name="status" label="Trạng thái">
          <Select
            options={[
              { value: 1, label: "Hoạt động" },
              { value: 2, label: "Tạm ẩn" },
            ]}
          />
        </Form.Item>

        <Form.Item name="parentid" label="Chuyên mục Cha">
          <Select options={parentCates} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

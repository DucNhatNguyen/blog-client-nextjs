import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Select, message } from "antd";
import { useFetchGet } from "../../hooks/useFetch";

export default function PopupTagDetail({
  id,
  open,
  onSubmit,
  onCancel,
  confirmModalLoading,
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState({});

  useEffect(() => {
    if (id == 0) return;

    const fetchData = async (id) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { statusCode, response } = await useFetchGet(`tag/${id}`);
      if (statusCode == 200) {
        form.setFieldsValue(response);
        setData(response);
      } else {
        message.error(`Có lỗi xãy ra!`);
      }
    };
    fetchData(id);
  }, [form, id]);

  return (
    <Modal
      open={open}
      title="Chỉnh sửa Tag"
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
        name="edit_tag_form"
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
      </Form>
    </Modal>
  );
}

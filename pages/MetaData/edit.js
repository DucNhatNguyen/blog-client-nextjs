import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Select, message } from "antd";
import { useFetchGet } from "../../hooks/useFetch";

export default function Edit({
  id,
  open,
  onSubmit,
  onCancel,
  confirmModalLoading,
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState({});

  const fetchData = async (id) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useFetchGet(`metadata/${id}`);
    if (statusCode == 200) {
      form.setFieldsValue(response);
      setData(response);
    } else {
      message.error(`Có lỗi xãy ra!`);
    }
  };

  useEffect(() => {
    if (id == 0) return;
    fetchData(id);
  }, [form, id]);

  return (
    <Modal
      open={open}
      title="Chỉnh sửa Metadata"
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

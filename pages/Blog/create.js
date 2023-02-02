import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Upload,
  Form,
  Input,
  Row,
  Col,
  message,
  Select,
  DatePicker,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import "dayjs/locale/vi";
import { Editor } from "@tinymce/tinymce-react";
import Slugify from "slugify";

export default function Create() {
  const [childCate, setChildCate] = useState([]);

  const fetchChildCates = () => {
    fetch(`https://blog-nodejs.onrender.com/api/category/child`).then(
      async (res) => {
        const da = await res.json();
        const options = da.data.map((x) => ({
          value: x.id,
          label: x.title,
        }));
        setChildCate([{ value: 0, label: "--Chọn chuyên mục--" }, ...options]);
      }
    );
  };

  useEffect(() => {
    //get child cates
    fetchChildCates();
  }, []);

  return (
    <Form
      name="basic"
      layout="vertical"
      //initialValues={{ remember: true }}
      autoComplete="off"
      style={{ padding: "25px" }}
      //onFinish={onFinish}
      //form={form}
    >
      <Row gutter={[32]}>
        <Col span={12}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true }, { type: "string", min: 3 }]}
          >
            <Input
              size="large"
              onBlur={(e) => {
                setAutoSlug(e.target.value);
              }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true }, { type: "string", min: 3 }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Sort description"
            name="sortdesc"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Trạng thái" name="status">
            <Select
              options={[
                { value: 1, label: "Hoạt động" },
                { value: 2, label: "Tạm ẩn" },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Thumbnail"
            name="thumbnail"
            rules={[{ required: true }]}
          >
            <Upload
              name="file"
              //action={`https://blog-nodejs.onrender.com/api/blog/upload/${slug}`}
              accept=".png, .jpg, .jpeg"
              //beforeUpload={beforeUpload}
              //onChange={onChange}
              listType="picture-card"
              showUploadList={false}
              multiple={false}
            >
              {/* {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
              ) : (
                uploadButton
              )} */}
            </Upload>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Chuyên mục" name="cateid">
            <Select options={childCate} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Nội dung"
            name="content"
            rules={[{ required: true }]}
          >
            <Editor
              apiKey="6vtz7yc7wtqz403rvcox0gquz2b707uuinaxql67j2ftnlmt"
              //   onEditorChange={(content, editor) => {
              //     handleChange(parseEditorData(content, editor));
              //   }}
              textareaName="content"
              //value={content}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" danger htmlType="submit" size="large">
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

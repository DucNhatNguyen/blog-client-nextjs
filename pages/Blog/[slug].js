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
import dayjs from "dayjs";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const options = [
  { value: "1", label: "Cong khai" },
  { value: "2", label: "Moi" },
  { value: "3", label: "Huy bo" },
];

export default function App() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [data, setData] = useState({
    id: "9f93ab1e-d25f-469b-bd00-46953538788e",
    author: 1,
    publicdate: "2015-01-30",
    sortdesc: "sdsdsdsdsds",
    status: 2,
    thumbnail:
      "https://dev.navicdn.com/test/podcasts/thumbnail/2022/12/27/jpg-20221227-162230-0000_20221227163848.jpg",
    view: null,
    slug: "sdsdsdsdsds",
    ishotblog: null,
    cateid: 2,
    title: "hard",
    content: "lele",
  });

  const slug = router.query.slug;
  const fetchData = async () => {
    const response = await fetch(`http://localhost:8080/api/blog/${slug}`);
    const data = await response.json();
    console.log(data);
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values) => {
    console.log("Success:", values);
    const { thumbnail, ...valuesRest } = values;

    await fetch(`http://localhost:8080/api/blog/${slug}`, {
      method: "PUT",
      body: JSON.stringify(valuesRest),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => await res.json())
      .then((res, { data }) => {
        if (res.status === 200) {
          message.success(`Edit success`);
          setData(data);
        } else {
          message.error(`Edit fail`);
        }
      });
  };

  const onChange = (info) => {
    getBase64(info.file.originFileObj, (url) => {
      setImageUrl(url);
    });
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error(`You can only upload JPG/PNG file!`);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={{ remember: true }}
      autoComplete="off"
      style={{ padding: "25px" }}
      onFinish={onFinish}
    >
      <Row gutter={[32]}>
        <Col span={12}>
          <Form.Item
            label="Title"
            name="title"
            initialValue={data.title}
            rules={[{ required: true }, { type: "string", min: 3 }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Slug"
            name="slug"
            initialValue={data.slug}
            rules={[{ required: true }, { type: "string", min: 3 }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Sort description"
            name="sortdesc"
            initialValue={data.sortdesc}
            rules={[{ required: false }, { type: "string", min: 3 }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Status"
            name="status"
            initialValue={data.status}
            rules={[{ required: true }]}
          >
            <Select size="large" options={options} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Thumbnail"
            name="thumbnail"
            rules={[{ required: true }]}
          >
            <Upload
              beforeUpload={beforeUpload}
              onChange={onChange}
              listType="picture-card"
              showUploadList={false}
              className="avatar-uploader"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Category"
            name="cateid"
            initialValue={data.cateid}
            rules={[{ required: true }]}
          >
            <Select size="large" options={options} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Public date"
            name="publicdate"
            initialValue={dayjs(data.publicdate, "DD/MM/YYYY")}
            rules={[{ required: true }]}
          >
            <DatePicker
              format={["DD/MM/YYYY", "DD/MM/YY"]}
              size="large"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Content"
            name="content"
            initialValue={data.content}
            //rules={[{ required: true }]}
          >
            <ReactQuill theme="snow" modules={modules} formats={formats} />
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

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
import moment from "moment";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

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
  const [data, setData] = useState({});
  const [form] = Form.useForm();

  const slug = router.query.slug;
  useEffect(() => {
    fetch(`https://blog-nodejs.onrender.com/api/blog/${slug}`).then(
      async (res) => {
        const da = await res.json();
        form.setFieldsValue({ ...da });
        setData({ ...da });
      }
    );
  }, [form, slug]);

  const onFinish = async (values) => {
    const { thumbnail, ...valuesRest } = values;

    await fetch(`https://blog-nodejs.onrender.com/api/blog/${slug}`, {
      method: "PUT",
      body: JSON.stringify(valuesRest),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const da = await res.json();
      if (res.status === 200) {
        message.success(`Cập nhật bài viết thành công.`);
        setData(data);
      } else {
        message.error(`Cập nhật bài viết không thành công.`);
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

  const worker = moment(data.publicdate, "YYYY-MM-DD");
  console.log("object", worker);
  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={{ remember: true, publicdate: worker }}
      autoComplete="off"
      style={{ padding: "25px" }}
      onFinish={onFinish}
      form={form}
    >
      <Row gutter={[32]}>
        <Col span={12}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true }, { type: "string", min: 3 }]}
          >
            <Input size="large" />
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
            rules={[{ required: false }, { type: "string", min: 3 }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select size="large" defaultValue="demo1">
              <Select.Option value="demo">Demo</Select.Option>
              <Select.Option value="demo1">Demosdsdssd1</Select.Option>
            </Select>
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
            rules={[{ required: true }]}
          >
            <Select size="large" options={options} />
          </Form.Item>
        </Col>
        {/* <Col span={12}>
          <Form.Item
            name="publicdateVal"
            label="Public date"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              size="large"
              style={{ width: "100%" }}
              value={dayjs("2021-01-30", "YYYY-MM-DD")}
              locale={locale}
            />
          </Form.Item>
        </Col> */}
        <Col span={24}>
          <Form.Item
            label="Content"
            name="content"
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

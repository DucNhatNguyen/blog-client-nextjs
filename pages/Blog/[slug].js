import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Button, Upload, Form, Input, Row, Col, message, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import "dayjs/locale/vi";
//import dynamic from "next/dynamic";
//import "react-quill/dist/quill.snow.css";
import { Editor } from '@tinymce/tinymce-react';

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: ['Montserrat'] }],
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

// const QuillNoSSRWrapper = dynamic(import("react-quill"), {
//   ssr: false,
//   loading: () => <p>Loading ...</p>,
// });

export default function App() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [data, setData] = useState({});
  const [childCate, setChildCate] = useState([]);
  const [content, setContent] = useState("");
  const [form] = Form.useForm();

  const slug = router.query.slug;

  const onFinish = async (values) => {
    console.log("inputt", {...values, content});
    // const { thumbnail, ...valuesRest } = values;

    // await fetch(`https://blog-nodejs.onrender.com/api/blog/${slug}`, {
    //   method: "PUT",
    //   body: JSON.stringify(valuesRest),
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Content-Type": "application/json",
    //   },
    // }).then(async (res) => {
    //   const da = await res.json();
    //   if (res.status === 200) {
    //     message.success(`Cập nhật bài viết thành công.`);
    //     setData(data);
    //   } else {
    //     message.error(`Cập nhật bài viết không thành công.`);
    //   }
    // });
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
    
    fetch(`https://blog-nodejs.onrender.com/api/blog/${slug}`).then(
      async (res) => {
        const da = await res.json();
        form.setFieldsValue({ ...da });
        setData({ ...da });
      }
    );
  }, [form, slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(value)
  };

  const parseEditorData = (content, editor) => {
    const { targetElm } = editor;
    const { name } = targetElm;
    return {
      target: {
        name,
        value: content
      }
    };
  };

  //const worker = moment(data.publicdate, "YYYY-MM-DD");
  //console.log("object", worker);
  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={{ remember: true }}
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
          <Form.Item label="Chuyên mục" name="cateid">
            <Select options={childCate} />
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
            label="Nội dung"
            name="content"
            rules={[{ required: true }]}
          >
            <Editor
              apiKey='6vtz7yc7wtqz403rvcox0gquz2b707uuinaxql67j2ftnlmt'
              onEditorChange={(content, editor) => {
                handleChange(parseEditorData(content, editor))
              }}
              textareaName="content"
              value={content}
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

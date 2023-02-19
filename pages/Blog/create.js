import React, { useEffect, useState, useContext } from "react";
import { Button, Upload, Form, Input, Row, Col, message, Select } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import "dayjs/locale/vi";
import { Editor } from "@tinymce/tinymce-react";
import Slugify from "slugify";
import { useFetchGet, useEffectAction } from "../../hooks/useFetch";
import { useRouter } from "next/router";
import { AppContext } from "../../context/AppContext";

export default function App() {
  const router = useRouter();
  const { setHeader } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setImageUrl] = useState();
  const [childCate, setChildCate] = useState([]);
  const [content, setContent] = useState("");
  const [autoSlug, setAutoSlug] = useState("");
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useEffectAction(
      `blog`,
      "POST",
      {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      JSON.stringify({ ...values, content, thumbnail })
    );
    console.log({ statusCode, response });
    if (statusCode === 200) {
      message.success(`Tạo bài viết thành công.`);
      router.push("/Blog");
    } else {
      message.error(`Có lỗi xảy ra!`);
    }
  };

  const onChange = (info) => {
    if (info.file.status == "uploading") {
      setLoading(true);
      message.success(`Đang tải file...`);
    }
    if (info.file.status == "error") {
      setLoading(false);
      setImageUrl(info.file.response.image_url);
      message.success(`Tải file thất bại!`);
    }
    if (info.file.status == "done") {
      setLoading(false);
      setImageUrl(info.file.response.image_url);
      //message.success(`Cập nhật avatar thành công!`);
    }
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

  const fetchChildCates = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useFetchGet(`category/child`);

    const options = response.data.map((x) => ({
      value: x.id,
      label: x.title,
    }));
    setChildCate([{ value: 0, label: "--Chọn chuyên mục--" }, ...options]);
  };

  useEffect(() => {
    setHeader("Tạo mới Bài viết");
    //get child cates
    fetchChildCates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(value);
  };

  const parseEditorData = (content, editor) => {
    const { targetElm } = editor;
    const { name } = targetElm;
    console.log({
      name,
      value: content,
    });
    return {
      target: {
        name,
        value: content,
      },
    };
  };

  useEffect(() => {
    form.setFieldsValue({ slug: Slugify(autoSlug) });
  }, [autoSlug, form]);

  return (
    <Form
      name="basic"
      layout="vertical"
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
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề" },
              { type: "string", min: 3 },
            ]}
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
            rules={[
              { required: true, message: "Slug không được để trống" },
              { type: "string", min: 3 },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Sort description"
            name="sortdesc"
            rules={[{ required: true, message: "Vui lòng nhập Mô tả" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Trạng thái">
            <Select
              options={[
                { value: 1, label: "Hoạt động" },
                { value: 2, label: "Tạm ẩn" },
              ]}
              disabled
              defaultValue={2}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Thumbnail"
            name="thumbnail"
            rules={[{ required: true, message: "Vui lòng chọn avatar" }]}
          >
            <Upload
              name="file"
              action={`${process.env.ROOT_NODE_API}blog/upload`}
              accept=".png, .jpg, .jpeg"
              beforeUpload={beforeUpload}
              onChange={onChange}
              listType="picture-card"
              showUploadList={false}
              multiple={false}
            >
              {thumbnail ? (
                <picture>
                  <img
                    src={thumbnail}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </picture>
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Chuyên mục"
            name="cateid"
            rules={[
              { required: true, message: "Vui lòng chọn chuyên mục cha" },
            ]}
          >
            <Select options={childCate} placeholder="Chọn chuyên mục Cha" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Nội dung"
            //name="content"
            rules={[{ required: true }]}
          >
            <Editor
              apiKey={process.env.API_KEY_EDITOR}
              onEditorChange={(content, editor) => {
                handleChange(parseEditorData(content, editor));
              }}
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

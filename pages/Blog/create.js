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

export default function App() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [data, setData] = useState({});
  const [childCate, setChildCate] = useState([]);
  const [content, setContent] = useState("");
  const [autoSlug, setAutoSlug] = useState("");
  const [form] = Form.useForm();

  const slug = router.query.slug;

  const jsonToFormData = (o) => {
    return Object.entries(o).reduce((d,e) => (d.append(...e),d), new FormData())
  }

  const onFinish = async (values) => {

    await fetch(`http://localhost:8080/api/blog`, {
      method: "POST",
      body: jsonToFormData({ ...values, content }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/form-data",
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
    console.log(info.file);
    // if (info.file.status == "uploading") {
    //   setLoading(true);
    //   message.success(`Đang cập nhật avatar...`);
    // }
    // if (info.file.status == "error") {
    //   setLoading(false);
    //   setImageUrl(info.file.response.image_url);
    //   message.success(`Cập nhật avatar thất bại!`);
    // }
    // if (info.file.status == "done") {
    //   setLoading(false);
    //   setImageUrl(info.file.response.image_url);
    //   message.success(`Cập nhật avatar thành công!`);
    // }
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
        setChildCate(options);
      }
    );
  };

  useEffect(() => {
    //get child cates
    fetchChildCates();
  }, [form, slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(value);
  };

  const parseEditorData = (content, editor) => {
    const { targetElm } = editor;
    const { name } = targetElm;
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
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }, { type: "string", min: 3 }]}
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
            rules={[{ required: true, message: "Slug không được để trống" }, { type: "string", min: 3 }]}
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
          <Form.Item label="Trạng thái" >
            <Select
              disabled
              options={[
                { value: 1, label: "Hoạt động" },
                { value: 2, label: "Tạm ẩn" },
              ]}
              defaultValue={2}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Thumbnail"
            name="file"
            rules={[{ required: true, message: "Vui lòng chọn hình Thumnail" }]}
          >
            <Upload
              name="file"
              //action={`https://blog-nodejs.onrender.com/api/blog/upload/${slug}`}
              accept=".png, .jpg, .jpeg"
              beforeUpload={beforeUpload}
              onChange={onChange}
              listType="picture-card"
              showUploadList={false}
              multiple={false}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Chuyên mục" name="cateid" rules={[{ required: true, message: "Vui lòng chọn chuyên mục cha" }]}>
            <Select options={childCate} placeholder="Chọn chuyên mục Cha"/>
          </Form.Item>
        </Col>
        
        <Col span={24}>
          <Form.Item
            label="Nội dung"
            //name="content"
            rules={[{ required: true }]}
          >
            <Editor
              apiKey="6vtz7yc7wtqz403rvcox0gquz2b707uuinaxql67j2ftnlmt"
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

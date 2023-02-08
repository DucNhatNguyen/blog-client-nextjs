import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { Table, Button, Popconfirm, message, Form } from "antd";
import Link from "next/link";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PopupCate from "./PopupCate";
import PopupCreate from "./PopupCreate";
import { AppContext } from "../../context/AppContext";
import { useFetchGet, useEffectAction } from "../../hooks/useFetch";

export default function Category() {
  const { isLoginState, setIsLoginState } = useContext(AppContext);
  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmModalLoading, setConfirmModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [parentCate, setParentCate] = useState([]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: "30%",
    },
    {
      title: "Status",
      dataIndex: "statusname",
      width: "20%",
    },
    {
      title: "Created Date",
      dataIndex: "createddate",
      width: "15%",
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: "20%",
      render: (t, r) => (
        <div style={{ textAlign: "center" }}>
          <EditOutlined
            style={{ marginRight: "20px" }}
            onClick={() => {
              showModal(r.id);
            }}
          />
          <Popconfirm
            title="Xóa chuyên mục"
            description={`Bạn có chắc muốn xóa chuyên mục: ${r.title}`}
            onConfirm={() => {
              console.log(r.id);
              handleDelete(r.id);
            }}
            okText="Yes"
            cancelText="Cancel"
          >
            <Link href="#">
              <DeleteOutlined />
            </Link>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchData = async (page) => {
    setLoading(true);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useFetchGet(
      `https://blog-nodejs.onrender.com/api/category?page=${page}&pagesize=10`
    );

    if (statusCode == 200) {
      setData(response.data);
      setTotal(response.total);
      setLoading(false);
    } else {
      message.error(`${statusCode} - Có lỗi xãy ra!`);
    }
  };

  const fetchCateParents = async () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useFetchGet(
      `https://blog-nodejs.onrender.com/api/category/parent`
    );

    if (statusCode == 200) {
      const options = response.data.map((x) => ({
        value: x.id,
        label: x.title,
      }));
      setParentCate([
        { value: 0, label: "--Không đặt Chuyên mục cha--" },
        ...options,
      ]);
    } else {
      message.error(`Có lỗi xãy ra!`);
    }
  };

  useEffect(() => {
    console.log("login statee ", isLoginState);
    if (!isLoginState) {
      router.push("/Home/login");
    }
    fetchData(1);
    fetchCateParents();
  }, []);

  const handleOkModal = async (values, id) => {
    setConfirmModalLoading(true);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useEffectAction(
      `https://blog-nodejs.onrender.com/api/category/${id}`,
      "PUT",
      {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      JSON.stringify(values)
    );

    setOpenModal(false);
    setConfirmModalLoading(false);
    fetchData(1);

    if (statusCode == 200) {
      message.success(`Cập nhật thông tin thành công!`);
    } else {
      message.error(`Có lỗi xãy ra!`);
    }
  };

  const showModal = (id) => {
    setOpenModal(true);
    setSelectedId(id);
  };

  const handleCreate = async (values) => {
    setConfirmModalLoading(true);
    await fetch(`https://blog-nodejs.onrender.com/api/category`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      setOpenCreateModal(false);
      setConfirmModalLoading(false);
      fetchData(1);
      const da = await res.json();
      if (res.status === 200) {
        message.success(`Tạo chuyên mục thành công!.`);
      } else {
        message.error(`Có lỗi xãy ra!`);
      }
    });
  };

  const handleDelete = async (id) => {
    await fetch(`https://blog-nodejs.onrender.com/api/category/${id}`, {
      method: "DELETE",
    }).then(async (res) => {
      fetchData(1);
      const da = await res.json();
      if (res.status === 200) {
        message.success(`Xóa chuyên mục thành công!.`);
      } else {
        message.error(`Có lỗi xãy ra!`);
      }
    });
  };

  return (
    <>
      <Head>
        <title>CMS - Chuyên mục</title>
      </Head>
      <Button
        type="primary"
        danger
        style={{ float: "right", margin: "15px 50px" }}
        onClick={() => {
          setOpenCreateModal(true);
        }}
      >
        Add
      </Button>
      <Table
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          total: total,
          onChange: (page) => {
            fetchData(page);
          },
        }}
        rowKey="id"
      />

      <PopupCate
        id={selectedId}
        open={openModal}
        onSubmit={handleOkModal}
        onCancel={() => {
          setOpenModal(false);
          setSelectedId(0);
        }}
        confirmModalLoading={confirmModalLoading}
        parentCates={parentCate}
      />

      <PopupCreate
        open={openCreateModal}
        onCancel={() => {
          setOpenCreateModal(false);
        }}
        onCreate={handleCreate}
        confirmModalLoading={confirmModalLoading}
        parentCates={parentCate}
      />
    </>
  );
}

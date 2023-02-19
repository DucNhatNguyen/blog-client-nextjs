import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { Table, Button, Popconfirm, message, Form } from "antd";
import Link from "next/link";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PopupTagDetail from "./PopupTagDetail";
import PopupTagCreate from "./PopupTagCreate";
import { AppContext } from "../../context/AppContext";
import { useFetchGet, useEffectAction } from "../../hooks/useFetch";

export default function Category() {
  const { setHeader } = useContext(AppContext);
  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmModalLoading, setConfirmModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: "30%",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      width: "30%",
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
            title="Xóa tag"
            description={`Bạn có chắc muốn xóa tag: ${r.title}`}
            onConfirm={() => {
              console.log(r.id);
              handleDelete(r.id);
            }}
            okText="Có"
            cancelText="Thoát"
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
      `tag?page=${page}&pagesize=10`
    );

    if (statusCode == 200) {
      setData(response.data);
      setTotal(response.total);
      setLoading(false);
    } else {
      message.error(`${statusCode} - Có lỗi xãy ra!`);
    }
  };

  useEffect(() => {
    setHeader("Tag");
    fetchData(1);
  }, []);

  const handleOkModal = async (values, id) => {
    setConfirmModalLoading(true);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useEffectAction(
      `tag/${id}`,
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
    await fetch(`tag`, {
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
        message.success(`Tạo tag thành công!.`);
      } else {
        message.error(`Có lỗi xãy ra!`);
      }
    });
  };

  const handleDelete = async (id) => {
    await fetch(`tag/${id}`, {
      method: "DELETE",
    }).then(async (res) => {
      fetchData(1);
      const da = await res.json();
      if (res.status === 200) {
        message.success(`Xóa tag thành công!.`);
      } else {
        message.error(`Có lỗi xãy ra!`);
      }
    });
  };

  return (
    <>
      <Head>
        <title>CMS - Tag</title>
      </Head>
      <Button
        type="primary"
        danger
        style={{ float: "right", margin: "15px 50px" }}
        onClick={() => {
          setOpenCreateModal(true);
        }}
      >
        Thêm
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

      <PopupTagDetail
        id={selectedId}
        open={openModal}
        onSubmit={handleOkModal}
        onCancel={() => {
          setOpenModal(false);
          setSelectedId(0);
        }}
        confirmModalLoading={confirmModalLoading}
      />

      <PopupTagCreate
        open={openCreateModal}
        onCancel={() => {
          setOpenCreateModal(false);
        }}
        onCreate={handleCreate}
        confirmModalLoading={confirmModalLoading}
      />
    </>
  );
}

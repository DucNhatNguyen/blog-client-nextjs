import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Table, Button, Popconfirm, message, Form } from "antd";
import Link from "next/link";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PopupCate from "./PopupCate";
import PopupCreate from "./PopupCreate";

export default function Category() {
  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmModalLoading, setConfirmModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

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

  const fetchData = (page) => {
    setLoading(true);
    fetch(
      `https://blog-nodejs.onrender.com/api/category?page=${page}&pagesize=10`
    )
      .then((res) => res.json())
      .then(({ data, total }) => {
        setData(data);
        setTotal(total);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handleOkModal = async (values, id) => {
    setConfirmModalLoading(true);
    await fetch(`https://blog-nodejs.onrender.com/api/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      setOpenModal(false);
      setConfirmModalLoading(false);
      fetchData(1);
      const da = await res.json();
      if (res.status === 200) {
        message.success(`Cập nhật thông tin thành công!`);
      } else {
        message.error(`Có lỗi xãy ra!`);
      }
    });

    // console.log("Received values of form: ", values);
    // setConfirmModalLoading(true);

    // setTimeout(() => {
    //   setOpenModal(false);
    //   setConfirmModalLoading(false);
    //   message.success(`Cập nhật thông tin thành công!`);
    // }, 2000);
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
        rowKey="uid"
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
      />

      <PopupCreate
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

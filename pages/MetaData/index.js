import React, { useEffect, useState, useContext } from "react";
import Head from "next/head";
import { Table, Button, Popconfirm, message, Form } from "antd";
import Link from "next/link";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext";
import { useFetchGet, useEffectAction } from "../../hooks/useFetch";
import Create from "./create";
import Edit from "./edit";

export default function MetaData() {
  const { isLoginState, setIsLoginState, setHeader } = useContext(AppContext);
  const [data, setData] = useState();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [confirmModalLoading, setConfirmModalLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const columns = [
    {
      title: "Key",
      dataIndex: "key",
      width: "30%",
    },
    {
      title: "Value",
      dataIndex: "value",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "description",
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
            title="Xóa mục"
            description={`Bạn có chắc muốn xóa : ${r.key}?`}
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
      `metadata?page=${page}&pagesize=10`
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
    setHeader("MetaData");
    fetchData(1);
  }, []);

  const handleOkModal = async (values, id) => {
    setConfirmModalLoading(true);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useEffectAction(
      `metadata/${id}`,
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useEffectAction(
      `metadata`,
      "POST",
      {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      JSON.stringify(values)
    );

    setOpenCreateModal(false);
    setConfirmModalLoading(false);
    fetchData(1);

    if (statusCode === 200) {
      message.success(`Tạo metadata thành công!.`);
    } else {
      message.error(`Có lỗi xãy ra!`);
    }
  };

  const handleDelete = async (id) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { statusCode, response } = await useEffectAction(
      `metadata/${id}`,
      "DELETE",
      {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      }
    );
    fetchData(1);
    if (statusCode === 200) {
      message.success(`Xóa mục thành công!.`);
    } else {
      message.error(`Có lỗi xãy ra!`);
    }
  };

  return (
    <>
      <Head>
        <title>CMS - MetaData</title>
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

      <Create
        open={openCreateModal}
        onCancel={() => {
          setOpenCreateModal(false);
        }}
        onCreate={handleCreate}
        confirmModalLoading={confirmModalLoading}
      />

      <Edit
        id={selectedId}
        open={openModal}
        onSubmit={handleOkModal}
        onCancel={() => {
          setOpenModal(false);
          setSelectedId(0);
        }}
        confirmModalLoading={confirmModalLoading}
      />
    </>
  );
}

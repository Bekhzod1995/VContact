import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { query, limit } from "firebase/firestore";
import { Button, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { DataType } from "../../interface";

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Tags",
    key: "tag",
    dataIndex: "tag",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => (
          <Tag color="volcano" key={tag}>
            {tag.toUpperCase()}
          </Tag>
        ))}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button type="dashed">
          <Link to={`user/${record.id}`}>View</Link>
        </Button>
      </Space>
    ),
  },
];

function List() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [usersInfo, setUsers] = useState({
    total: 0,
    users: [],
  });
  const usersCollectionRef = collection(db, "users");
  const [isLoading, setLoading] = useState<boolean>(false);

  const getUsers = async () => {
    setLoading(true);
    const total = await getCountFromServer(usersCollectionRef);
    const totalUsersNumber = total.data().count;
    let lastOfCurrent = "";
    let lastVisible = "";
    let initialRequest = "";

    if (Number(searchParams.get("page")) === 1) {
      initialRequest = query(usersCollectionRef, limit(2));
    } else {
      const lastIndx = await getDocs(usersCollectionRef);
      const test =
        lastIndx.docs[
          Number(searchParams.get("page")) *
            Number(searchParams.get("page-size")) -
            Number(searchParams.get("page-size")) -
            1
        ];

      lastVisible = doc(db, "users", test.id);

      lastOfCurrent = await getDoc(lastVisible);
      initialRequest = query(
        usersCollectionRef,
        startAfter(lastOfCurrent),
        limit(2)
      );
    }

    const documentSnapshots = await getDocs(initialRequest);
    setUsers({
      total: totalUsersNumber,
      users: documentSnapshots.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        key: doc.id,
      })),
    });
    setLoading(false);
  };

  useEffect(() => {
    navigate("/?page=1&page-size=2");
  }, []);

  useEffect(() => {
    getUsers();
    // Object.fromEntries(searchParams.entries())
  }, [searchParams]);

  return (
    <div className="container">
      <div className="table-container">
        <h3 style={{ textAlign: "center" }}>Users</h3>
        <Button type="primary">
          <Link to="create">Add user</Link>
        </Button>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={usersInfo.users}
          pagination={{
            total: usersInfo.total,
            pageSize: Number(searchParams.get("page-size")),
            current: Number(searchParams.get("page")),
            onChange: (currPage: number, pageSize: number) => {
              navigate(`/?page=${currPage}&page-size=${pageSize}`);
            },
          }}
        />
      </div>
    </div>
  );
}

export default List;

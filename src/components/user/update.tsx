import { Button, Form, Input, InputNumber, Select } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { IUser } from "../../interface";
import { useForm } from "antd/es/form/Form";
import { getObjectDiff } from "../../utils";
import { tagOptions } from "../../staticData";

const SingleUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<IUser>({
    name: "",
    email: "",
    phone: null,
    id: "",
    tags: [],
  });
  const [form] = useForm();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userDb] = useState(doc(db, "users", userId));
  const navigate = useNavigate();

  const onFinish = async (values: IUser) => {
    const difference = getObjectDiff(user, values);
    const finalResult = difference.reduce((acc, curValue) => {
      return {
        ...acc,
        [curValue]: values[curValue],
      };
    }, {});

    if (Object.keys(finalResult).length) {
      setLoading(true);
      await updateDoc(userDb, finalResult);
      setLoading(false);
      getUser();
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const getUser = async () => {
    setLoading(true);
    const requestedUser = await getDoc(userDb);
    form.setFieldsValue(requestedUser.data());
    setLoading(false);
    return setUser(requestedUser.data());
  };

  const deleteUser = async () => {
    setLoading(true);
    await deleteDoc(userDb);
    setLoading(false);
    navigate("/?page=1&page-size=2");
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="container">
      <h3>Update a user</h3>
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={user}
        autoComplete="off"
        form={form}
        disabled={isLoading}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <InputNumber type="number" addonBefore="+" style={{ width: 200 }} />
        </Form.Item>

        <Form.Item
          label="Tags"
          name="tags"
          rules={[{ required: true, message: "Please input your phone tags!" }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            options={tagOptions}
          />
        </Form.Item>

        <Form.Item className="buttons-container">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
          <Button type="link" style={{ marginLeft: 8, marginRight: 8 }}>
            <Link to={"/?page=1&page-size=2"}>Back</Link>
          </Button>
          <Button type="primary" danger onClick={deleteUser}>
            Delete
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SingleUser;

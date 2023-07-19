import { Button, Form, Input, InputNumber, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { IUser } from "../../interface";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase-config";
import { tagOptions } from "../../staticData";

const Create = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const usersCollectionRef = collection(db, "users");
  const navigate = useNavigate();

  const onFinish = async (values: IUser) => {
    setLoading(true);
    await addDoc(usersCollectionRef, values);
    setLoading(false);
    navigate("/?page=1&page-size=2");
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="container">
      <h3>Create User</h3>
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
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

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" loading={isLoading} htmlType="submit">
            Submit
          </Button>
          <Button type="link" style={{ marginLeft: 8 }}>
            <Link to={"/?page=1&page-size=2"}>Back</Link>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Create;

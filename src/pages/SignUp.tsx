import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { createOrUpdateCreatorProfile } from '../firebase/firestore';
import { signUp } from '../firebase/auth';

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = () => {
  const onFinish = async (values: any) => {
    try {
      // Register user with Firebase Auth (role: 'creator')
      const { user } = await signUp(values.email, values.password, 'creator', values.username);
      // Save creator profile to Firestore
      await createOrUpdateCreatorProfile(user.uid, {
        name: values.username,
        email: values.email,
        avatarUrl: user.photoURL || '',
        // Add more fields as needed
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-box">
        <h2>Sign Up</h2>
        <Form
          name="normal_register"
          className="register-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="agreement" valuePropName="checked" noStyle>
              <Checkbox>
                I have read the <a href="/terms">agreement</a>
              </Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
            >
              Register
            </Button>
            Or <Link to="/signin">login now!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUp; 
import React, { useContext, useState } from "react";
import { Form, Button, Image } from "antd";
import Lottie from "react-lottie";
import logo from "../assets/logo-FixItRight.png";
import animationData from "../assets/Hello-Animation.json";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { GetCurrentLogin, LoginUserApi } from "../services/api";
import { AuthContext } from "../contexts/auth.context";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await LoginUserApi({
        UserName: values.username,
        Password: values.password,
      });
      console.log("x",response);
      if (response) {
        localStorage.setItem("token", response.AccessToken);
      
        const resDataLogin = await GetCurrentLogin();
      
        console.log("resDataLogin",resDataLogin);
        setAuth({
          isAuthenticated: true,
          user: {
            id: resDataLogin?.id,
            imgUrl: resDataLogin?.Avatar,
            email: resDataLogin?.IsVerified,
            name: resDataLogin?.Fullname,
            role: resDataLogin.Roles[0]
          },
        });
        console.log("resDataLoginxxxx>",resDataLogin.Roles[0]);
        if (resDataLogin.Roles[0] === "Admin") {
         
          navigate("/admin/manager-account");
        } 
        setLoading(false);

      }
    } catch (error) {
      setLoading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-1/2 h-full flex items-center justify-center flex-col px-4 font-sans">
      {/* Logo and Text */}
      <div className="flex items-center space-x-4 w-full justify-start mb-4">
        <Image width={80} src={logo} preview={false} />
        <div className="text-2xl font-semibold">
          <div className="text-[#4A628A]">FixIt</div>
          <div className="mt-1 text-[#4A628A]">Right</div>
        </div>
      </div>

      {/* Welcome and Please log in */}
      <div className="mt-2 mb-4 w-full">
        <div className="flex items-center space-x-1">
          <div className="text-left text-xl font-bold">Welcome</div>
          <div>
            <Lottie options={defaultOptions} height={30} width={30} />
          </div>
        </div>
        <div className="text-left text-sm text-gray-500 mt-2">
          Please log in here
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md mt-5">
        <Form
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <div className="relative border-2 border-[#4A628A] rounded-lg p-2 text-xs">
              <span className="absolute -top-3 left-3 bg-white px-1 text-[#4A628A] text-xs">
                Username
              </span>
              <input
                type="text"
                className="w-full border-none focus:outline-none ml-2 text-black text-sm"
                placeholder="robertallen@example.com"
              />
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <div className="relative border-2 border-[#4A628A] rounded-lg p-2 text-xs mt-2">
              <span className="absolute -top-3 left-3 bg-white px-1 text-[#4A628A] text-xs">
                Password
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border-none focus:outline-none ml-2 text-black text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={handlePasswordVisibility}
                className="absolute right-3 top-2 text-[#4A628A] text-sm"
              >
                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </button>
            </div>
          </Form.Item>

          <div className="text-right mb-2">
            <a
              href="/forgot-password"
              className="text-black hover:text-gray-700 text-sm"
            >
              Forgot Password?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="button-customize-1 h-10"
              loading={loading} // Add loading to button
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;

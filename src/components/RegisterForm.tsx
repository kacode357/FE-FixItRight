import React, { useState } from "react";
import { Form, Button, Select, DatePicker } from "antd";
import Lottie from "react-lottie";
import animationData from "../assets/Register-Animation.json"; // Import Lottie animation
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"; // Import eye icons

const RegisterForm: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const [password, setPassword] = useState(""); // State for password input

    const onFinish = (values: { username: string; birthday: string; fullname: string; gender: string; password: string; phoneNumber: string }) => {
        console.log("Form values:", values);
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
        setShowPassword(!showPassword); // Toggle the password visibility
    };

    return (
        <div className="transform translate-x-full w-1/2 h-full flex items-center justify-center flex-col">
            {/* Register Form Container */}
            <div className="w-full max-w-sm p-4 bg-white rounded-lg">
                {/* Logo and Text */}
                <div className="mt-2 mb-4 w-full text-center">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="text-lg font-bold">Sign up</div>
                        <div>
                            <Lottie options={defaultOptions} height={30} width={30} />
                        </div>
                    </div>
                </div>

                {/* Register Form */}
                <Form name="register_form" onFinish={onFinish} layout="vertical" className="space-y-4">

                    {/* Username Input */}
                    <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]} className="mb-4">
                        <div className="relative border-2 border-[#4A628A] rounded-lg p-2 text-xs">
                            <span className="absolute -top-3 left-3 bg-white px-1 text-[#4A628A] text-xs">Username</span>
                            <input
                                type="text"
                                className="w-full border-none focus:outline-none ml-2 text-black text-sm"
                                placeholder="username123"
                            />
                        </div>
                    </Form.Item>

                    {/* Birthday Input */}
                    <Form.Item className="border-2 border-[#4A628A] rounded-lg p-1 text-xs mb-4" name="birthday" rules={[{ required: true, message: "Please select your birthday!" }]}>
                        <DatePicker
                            className="w-full border-none focus:outline-none text-black text-sm py-1"
                            placeholder="Select your birthday"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    {/* Gender Input */}
                    <Form.Item className="relative border-2 border-[#4A628A] rounded-lg p-0.5 text-xs mb-4" name="gender" rules={[{ required: true, message: "Please select your gender!" }]}>
                        <Select className="custom-select text-xs" placeholder="Select your gender">
                            <Select.Option value="male" className="custom-option">Male</Select.Option>
                            <Select.Option value="female" className="custom-option">Female</Select.Option>
                            <Select.Option value="other" className="custom-option">Other</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Fullname Input */}
                    <Form.Item name="fullname" rules={[{ required: true, message: "Please input your fullname!" }]} className="mb-4">
                        <div className="relative border-2 border-[#4A628A] rounded-lg p-2 text-xs">
                            <span className="absolute -top-3 left-3 bg-white px-1 text-[#4A628A] text-xs">Fullname</span>
                            <input
                                type="text"
                                className="w-full border-none focus:outline-none ml-2 text-black text-sm"
                                placeholder="John Doe"
                            />
                        </div>
                    </Form.Item>

                    {/* Password Input */}
                    <Form.Item name="password" rules={[{ required: true, message: "Please enter your password!" }]} className="mb-4">
                        <div className="relative border-2 border-[#4A628A] rounded-lg p-2 text-xs">
                            <span className="absolute -top-3 left-3 bg-white px-1 text-[#4A628A] text-xs">Password</span>
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
                                className="absolute right-3 top-1 text-[#4A628A] text-xl"
                            >
                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </button>
                        </div>
                    </Form.Item>

                    {/* Phone Number Input */}
                    <Form.Item name="phoneNumber" rules={[{ required: true, message: "Please input your phone number!" }]} className="mb-4">
                        <div className="relative border-2 border-[#4A628A] rounded-lg p-2 text-xs">
                            <span className="absolute -top-3 left-3 bg-white px-1 text-[#4A628A] text-xs">Phone Number</span>
                            <input
                                type="text"
                                className="w-full border-none focus:outline-none ml-2 text-black text-sm"
                                placeholder="123-456-7890"
                            />
                        </div>
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block className="button-customize-1 h-10">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default RegisterForm;

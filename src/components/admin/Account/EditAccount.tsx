import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, DatePicker, Select, message } from "antd";
import moment from "moment";
import { ViewUser, UpdateUser } from "../../../services/api";
import FileUploader from "../../../utils/FileUploader"; // Import FileUploader

const { Option } = Select;

interface EditAccountProps {
  userId: string;
  visible: boolean;
  onClose: () => void;
  refreshUsers: () => void;
}

const EditAccount: React.FC<EditAccountProps> = ({ userId, visible, onClose, refreshUsers }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (visible) {
      fetchUserDetails();
    } else {
      form.resetFields();
    }
  }, [visible, userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const data = await ViewUser(userId);

      form.setFieldsValue({
        ...data,
        Birthday: data.Birthday ? moment(data.Birthday, "YYYY-MM-DD") : null,
      });

      setAvatarUrl(data.Avatar || "");
    } catch (error) {
      message.error("Failed to fetch user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);
      const formattedData = {
        Fullname: values.Fullname,
        Gender: values.Gender,
        Birthday: values.Birthday ? values.Birthday.format("YYYY-MM-DD") : "",
        Address: values.Address || null,
        Avatar: avatarUrl,
        Email: values.Email,
      };

      await UpdateUser(userId, formattedData);
      message.success("User information updated successfully!");
      refreshUsers();
      onClose();
    } catch (error) {
      message.error("Failed to update user information. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Edit Account Information" open={visible} onCancel={onClose} footer={null} centered>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="Fullname"
          label="Full Name"
          rules={[{ required: true, message: "Please enter the full name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="Gender" label="Gender" rules={[{ required: true, message: "Please select the gender!" }]}>
          <Select>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="Birthday"
          label="Date of Birth"
          rules={[{ required: true, message: "Please select the date of birth!" }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="Email" label="Email" rules={[{ required: true, message: "Please enter the email!" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="Address" label="Address">
          <Input />
        </Form.Item>

        {/* Thay thế Upload bằng FileUploader */}
        <Form.Item label="Avatar">
          <FileUploader onUploadSuccess={(url) => setAvatarUrl(url)} defaultImage={avatarUrl} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>
            Close
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAccount;

import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { ViewUser, UpdateUser } from '../../../services/api';

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
  const [userName, setUserName] = useState<string>('');

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
      setUserName(data.UserName);

      // Format existing file URLs for Ant Design Upload
      const formatFileList = (fileUrl: string) =>
        fileUrl
          ? [
              {
                uid: '-1',
                name: fileUrl.split('/').pop(),
                status: 'done',
                url: fileUrl,
              },
            ]
          : [];

      form.setFieldsValue({
        ...data,
        Birthday: data.Birthday ? moment(data.Birthday, 'YYYY-MM-DD') : null,
        CccdFront: formatFileList(data.CccdFront),
        CccdBack: formatFileList(data.CccdBack),
        Avatar: formatFileList(data.Avatar),
      });
    } catch (error) {
      message.error('Failed to fetch user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  const handleFinish = async (values: any) => {
    try {
      setLoading(true);
  
      const formattedData = {
        Fullname: values.Fullname,
        Gender: values.Gender,
        Birthday: values.Birthday ? values.Birthday.format("YYYY-MM-DD") : "",
        PhoneNumber: values.PhoneNumber,
        Address: values.Address || null,
        CccdFront: values.CccdFront?.[0]?.originFileObj || null, // Lấy File object
        CccdBack: values.CccdBack?.[0]?.originFileObj || null,  // Lấy File object
        Avatar: values.Avatar?.[0]?.originFileObj || null,      // Lấy File object
        UserName: userName, // Sử dụng UserName từ state
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
    <Modal
      title="Edit Account Information"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="Fullname"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter the full name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="Gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select the gender!' }]}
        >
          <Select>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="Birthday"
          label="Date of Birth"
          rules={[{ required: true, message: 'Please select the date of birth!' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="PhoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter the phone number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="Address" label="Address">
          <Input />
        </Form.Item>

        <Form.Item
  name="CccdFront"
  label="ID Card (Front)"
  valuePropName="fileList"
  getValueFromEvent={normFile}
>
  <Upload listType="picture" beforeUpload={() => false} accept="image/*">
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
</Form.Item>

<Form.Item
  name="CccdBack"
  label="ID Card (Back)"
  valuePropName="fileList"
  getValueFromEvent={normFile}
>
  <Upload listType="picture" beforeUpload={() => false} accept="image/*">
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
</Form.Item>

<Form.Item
  name="Avatar"
  label="Avatar"
  valuePropName="fileList"
  getValueFromEvent={normFile}
>
  <Upload listType="picture" beforeUpload={() => false} accept="image/*">
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
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
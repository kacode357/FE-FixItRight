import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, message } from 'antd';
import { AddAccountCustomerApi, AddAccountMechanistsApi } from '../../../services/api';
import moment from 'moment';

const { Option } = Select;

interface AddUserProps {
  visible: boolean;
  onClose: () => void;
  refreshUsers: () => void;
  onAddUser: (values: any) => void;
}

const AddUser: React.FC<AddUserProps> = ({ visible, onClose, refreshUsers }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddUser = async (values: any) => {
    setLoading(true);
    try {
      // Convert Birthday to string format using moment and exclude Role from payload
      const { Role, ...payload } = {
        ...values,
        Birthday: values.Birthday ? moment(values.Birthday).format('YYYY-MM-DD') : null, // Format as 'YYYY-MM-DD'
      };

      console.log('Payload without role:', payload);

      if (Role === 'Customer') {
        await AddAccountCustomerApi(payload);
      } else if (Role === 'Mechanist') {
        await AddAccountMechanistsApi(payload);
      } else {
        throw new Error('Invalid role selected!');
      }

      message.success('User added successfully!');
      form.resetFields();
      refreshUsers();
      onClose();
    } catch (error: any) {
      console.error('Error adding user:', error); // Debugging info
      message.error(error.message || 'Failed to add user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add User"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleAddUser}
      >
        <Form.Item
          name="Fullname"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter the full name!' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>
        <Form.Item
          name="UserName"
          label="Username"
          rules={[{ required: true, message: 'Please enter the username!' }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          name="PassWord"
          label="Password"
          rules={[{ required: true, message: 'Please enter the password!' }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
        <Form.Item
          name="PhoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter the phone number!' }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>
        <Form.Item
          name="Gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select the gender!' }]}
        >
          <Select placeholder="Select gender">
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="Birthday"
          label="Birthday"
          rules={[{ required: true, message: 'Please select the birthday!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="Role"
          label="Role"
          rules={[{ required: true, message: 'Please select a role!' }]}
        >
          <Select placeholder="Select role">
            <Option value="Customer">Customer</Option>
            <Option value="Mechanist">Mechanist</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUser;

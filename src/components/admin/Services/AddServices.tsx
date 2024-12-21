import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { AddRepairServiceApi } from '../../../services/api';

interface AddServicesProps {
  visible: boolean;
  onClose: () => void;
  ResetSerVices: () => void;
}

const AddServices: React.FC<AddServicesProps> = ({ visible, onClose, ResetSerVices }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State để lưu file được chọn

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]); // Lưu file vào state
    }
  };

  const handleSubmit = async (values: any) => {
    if (!selectedFile) {
      message.error('Please upload a file!');
      return;
    }

    setLoading(true);
    try {
      const formData = {
        File: selectedFile, 
        Name: values.serviceName,
        Description: values.description,
        Price: parseFloat(values.price),
      };
      await AddRepairServiceApi(formData);
      message.success('Service added successfully!');
        ResetSerVices(); 
      form.resetFields();
      setSelectedFile(null); 
      onClose();
    } catch (error) {
      message.error('Failed to add service. Please try again.');
      console.error('Error adding service:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New Service"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="serviceName"
          label="Service Name"
          rules={[{ required: true, message: 'Please enter the service name!' }]}
        >
          <Input placeholder="Enter service name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the description!' }]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[
            { required: true, message: 'Please enter the price!' },
            { type: 'number', transform: value => Number(value), message: 'Price must be a number!' },
          ]}
        >
          <Input placeholder="Enter price" type="number" />
        </Form.Item>

        <Form.Item
          label="File"
          rules={[{ required: true, message: 'Please upload a file!' }]}
        >
          <Input type="file" onChange={handleFileChange} /> {/* Lắng nghe sự kiện chọn file */}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Service
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddServices;

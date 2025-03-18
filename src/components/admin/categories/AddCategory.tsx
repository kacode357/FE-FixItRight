import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { categoryService } from "../../../services/categoryService";

interface AddCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await categoryService.createCategory(values.categoryName);
      message.success("Category added successfully!");
      onSuccess();
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Add New Category" visible={visible} onCancel={onClose} footer={null} centered>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="categoryName"
          label="Category Name"
          rules={[{ required: true, message: "Please enter category name!" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Category
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;

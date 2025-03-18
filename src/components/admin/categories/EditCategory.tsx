import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { categoryService } from "../../../services/categoryService";

interface EditCategoryProps {
  visible: boolean;
  categoryId: string;
  onClose: () => void;
  onSave: (id: string, data: any) => void;
  refreshCategories: () => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({
  visible,
  categoryId,
  onClose,
  onSave,
  refreshCategories,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && categoryId) {
      categoryService
        .getCategoryId(categoryId)
        .then((data) => {
          form.setFieldsValue({ name: data.Name });
        })
        .catch((error) => {
          message.error("Failed to fetch category data");
          console.error(error);
        });
    } else {
      form.resetFields();
    }
  }, [visible, categoryId, form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      await categoryService.updateCategory(categoryId, values.name);
      message.success("Category updated successfully!");
      onSave(categoryId, { Name: values.name });
      refreshCategories();
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to update category. Please try again.");
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Edit Category" open={visible} onCancel={onClose} footer={null} centered>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please enter the category name!" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Category
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategory;

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { GetRepairServiceById, EditRepairServiceApi } from "../../../services/api";
import FileUploader from "../../../utils/FileUploader"; // Import FileUploader

interface EditServiceProps {
  visible: boolean;
  serviceId: string;
  onClose: () => void;
  onSave: (id: string, data: any) => void;
  ResetSerVices: () => void;
}

const EditService: React.FC<EditServiceProps> = ({
  visible,
  serviceId,
  onClose,
  onSave,
  ResetSerVices,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (visible && serviceId) {
      GetRepairServiceById(serviceId)
        .then((data) => {
          form.setFieldsValue({
            name: data.Name,
            description: data.Description,
            price: data.Price,
          });

          // Gán URL ảnh hiện tại (nếu có) để hiển thị
          setImageUrl(data.ImageUrl || "");
        })
        .catch((error) => {
          message.error("Failed to fetch service data");
          console.error(error);
        });
    } else {
      form.resetFields();
      setImageUrl("");
    }
  }, [visible, serviceId, form]);

  const handleSave = async (values: any) => {
    if (!imageUrl) {
      message.error("Please upload an image!");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        ImageUrl: imageUrl, // Lưu URL từ Firebase thay vì file
        Name: values.name,
        Description: values.description,
        Price: parseFloat(values.price),
      };

      await EditRepairServiceApi(serviceId, requestData);
      message.success("Service updated successfully!");
      onSave(serviceId, requestData);
      ResetSerVices();
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Failed to update service. Please try again.");
      console.error("Error updating service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Service"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          name="name"
          label="Service Name"
          rules={[{ required: true, message: "Please enter the service name!" }]}
        >
          <Input placeholder="Enter service name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description!" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[
            { required: true, message: "Please enter the price!" },
            { type: "number", transform: (value) => Number(value), message: "Price must be a number!" },
          ]}
        >
          <Input placeholder="Enter price" type="number" />
        </Form.Item>

        {/* Thay thế input file bằng FileUploader */}
        <Form.Item label="Service Image">
          <FileUploader
            onUploadSuccess={(url) => setImageUrl(url)}
            defaultImage={imageUrl}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save Service
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditService;

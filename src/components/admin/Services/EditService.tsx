import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { GetRepairServiceById, EditRepairServiceApi } from "../../../services/api";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to store the selected file

  useEffect(() => {
    if (visible && serviceId) {
      GetRepairServiceById(serviceId)
        .then((data) => {
          form.setFieldsValue({
            name: data.Name,
            description: data.Description,
            price: data.Price,
          });
        })
        .catch((error) => {
          message.error("Failed to fetch service data");
          console.error(error);
        });
    }
  }, [visible, serviceId, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]); // Store the selected file
    }
  };

  const handleSave = async (values: any) => {
    if (!selectedFile) {
      message.error("Please upload a file!");
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        File: selectedFile,
        Name: values.name,
        Description: values.description,
        Price: parseFloat(values.price),
      };

      await EditRepairServiceApi(serviceId, requestData);
      message.success("Service updated successfully!");
      onSave(serviceId, requestData); // Notify parent component
      ResetSerVices(); // Reset services if needed
      form.resetFields();
      setSelectedFile(null);
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
      visible={visible}
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

        <Form.Item label="File" rules={[{ required: true, message: "Please upload a file!" }]}>
          <Input type="file" onChange={handleFileChange} /> {/* Listen for file selection */}
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

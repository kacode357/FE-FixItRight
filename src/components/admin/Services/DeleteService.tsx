import React from "react";
import { Modal, Button } from "antd";
import { DeleteRepairServiceApi } from "../../../services/api"; // Import the API function

interface DeleteServiceProps {
  visible: boolean;
  serviceId: string;
  onClose: () => void;
  onConfirm: (id: string) => void;
  ResetSerVices: () => void;
}

const DeleteService: React.FC<DeleteServiceProps> = ({
  visible,
  serviceId,
  onClose,
  onConfirm,
  ResetSerVices,
}) => {
  const handleConfirm = async () => {
    try {
      await DeleteRepairServiceApi(serviceId);
      onConfirm(serviceId);
        
      ResetSerVices();
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      onClose();
    }
  };

  console.log("DeleteService", serviceId);

  return (
    <Modal
      title="Delete Service"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="confirm" type="primary" danger onClick={handleConfirm}>
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this service?</p>
    </Modal>
  );
};

export default DeleteService;

import { Modal, Button } from "antd";
import { categoryService } from "../../../services/categoryService"; // Import categoryService

interface DeleteCategoryProps {
  visible: boolean;
  categoryId: string;
  onClose: () => void;
  onConfirm: (id: string) => void;
  refreshCategories: () => void; // Để cập nhật danh sách categories sau khi xóa
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({
  visible,
  categoryId,
  onClose,
  onConfirm,
  refreshCategories,
}) => {
  const handleConfirm = async () => {
    try {
      await categoryService.deleteCategory(categoryId); // Gọi API xóa category
      onConfirm(categoryId); // Callback để thông báo xóa thành công
      refreshCategories(); // Cập nhật lại danh sách categories
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      onClose(); // Đóng modal sau khi hoàn tất
    }
  };

  console.log("DeleteCategory", categoryId);

  return (
    <Modal
      title="Delete Category"
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
      <p>Are you sure you want to delete this category?</p>
    </Modal>
  );
};

export default DeleteCategory;

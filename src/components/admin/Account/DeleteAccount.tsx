import { DeleteUser } from '../../../services/api';
import { Modal, message } from 'antd';

const { confirm } = Modal;

const deleteAccount = async (id: string, refreshUsers: () => void) => {
  confirm({
    title: 'Are you sure you want to delete this account?',
    content: 'This action cannot be undone.',
    okText: 'Yes, Delete',
    okType: 'danger',
    cancelText: 'No, Cancel',
    onOk: async () => {
      try {
        console.log(`Deleting account with ID: ${id}`);
        const result = await DeleteUser(id); // Call the API to delete the user
        console.log('Account deleted successfully:', result);
        message.success('Account deleted successfully!');
        refreshUsers(); // Refresh the user list after deletion
      } catch (error) {
        console.error('Error deleting account:', error);
        message.error('Failed to delete account. Please try again later.');
      }
    },
    onCancel() {
      console.log('User canceled account deletion');
    },
  });
};

export default deleteAccount;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Tag, Typography } from 'antd';
import { ViewUser } from '../../../services/api'; // Import your API function

const { Text } = Typography;

interface ViewAccountProps {
  userId: string;
  visible: boolean;
  onClose: () => void;
}

const ViewAccount: React.FC<ViewAccountProps> = ({ userId, visible, onClose }) => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && userId) {
      fetchUserDetails();
    }
  }, [visible, userId]);

  const fetchUserDetails = async () => {
    setError(null);
    try {
      const data = await ViewUser(userId); 
      console.log("xx",data);
      setUserDetails(data);
    } catch (err) {
      setError('Failed to load user details. Please try again later.');
    }
  };

  return (
    <Modal
      title="User Information"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
     centered
    >
      {error ? (
        <Text type="danger">{error}</Text>
      ) : userDetails ? (
        <Card bordered style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center'}}>
            <img
              src={userDetails.Avatar}
              alt="Avatar"
              style={{ borderRadius: '50%', width: 100, height: 100 }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '150px auto', gap: '10px' }}>
            <Text strong>Full Name:</Text>
            <Text>{userDetails.Fullname}</Text>

            <Text strong>Username:</Text>
            <Text>{userDetails.UserName}</Text>

            <Text strong>Phone Number:</Text>
            <Text>{userDetails.PhoneNumber}</Text>

            <Text strong>Gender:</Text>
            <Text>{userDetails.Gender}</Text>

            <Text strong>Birthday:</Text>
            <Text>{new Date(userDetails.Birthday).toLocaleDateString()}</Text>

            <Text strong>Address:</Text>
            <Text>{userDetails.Address || 'Not Provided'}</Text>

            <Text strong>Status:</Text>
            <Tag color={userDetails.Active ? 'green' : 'red'} style={{ width: "100px", textAlign: "center" }}>
              {userDetails.Active ? 'Active' : 'Inactive'}
            </Tag>

            <Text strong>Verification:</Text>
            <Tag color={userDetails.IsVerified ? 'blue' : 'orange'} style={{ width: "100px", textAlign: "center" }}>
              {userDetails.IsVerified ? 'Verified' : 'Not Verified'}
            </Tag>

            <Text strong>Roles:</Text>
            <div>
              {userDetails.Roles.map((role: string) => (
                <Tag color="geekblue" key={role} style={{ width: "100px", textAlign: "center" }}>
                  {role}
                </Tag>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Text>No user details available.</Text>
      )}
    </Modal>
  );
};

export default ViewAccount;

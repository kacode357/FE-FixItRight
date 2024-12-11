import { useContext } from 'react';
import { AuthContext } from '../contexts/auth.context';

const ManagetAccount = () => {
  const { auth } = useContext(AuthContext); // Lấy dữ liệu từ AuthContext
  
  const userRole = auth?.user?.role; 
  console.log("Check authx",userRole);
  return (
    <div>
    as
    </div>
  );
};

export default ManagetAccount;

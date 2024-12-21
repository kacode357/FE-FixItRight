import { ROLES } from '../constants/index'; 
import React from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthWrapper } from '../contexts/auth.context';
import PrivateRoute from './PrivateRoute'; 
import App from '../App';

import Login from '../pages/auth/auth';

import SettingUser from '../pages/User/SettingUser';
import ManagerAccount from '../pages/admin/ManagerAccount';

import Layout1 from '../layout/LayoutHeader';
import Layout2 from '../layout/LayoutDefault'; 
import Test from '../pages/test';
import ManagerServices from '../pages/admin/ManagerServices';

const router = createBrowserRouter([
  { 
    path: "/", 
    element: <App />, 
    children: [
      { index: true, element: <Navigate to="/login" replace /> }, 
      { path: "login", element: <Login /> },
      { path: "test", element: <Test /> },
      {
        path: "admin",
        element: <Layout1 />, 
        children: [
          { path: "manager-account", element: <PrivateRoute element={ManagerAccount} allowedRoles={[ROLES.ADMIN]} /> },
          { path: "manager-services", element: <PrivateRoute element={ManagerServices} allowedRoles={[ROLES.ADMIN]} /> },
        ],
      },
      {
        path: "user",
        element: <Layout2 />,
        children: [
          { path: "setting", element: <PrivateRoute element={SettingUser} allowedRoles={[ROLES.USER]} /> },
        ],
      },
    ],
  },
]);

const RouterComponent: React.FC = () => {
  return (
    <AuthWrapper> 
      <RouterProvider router={router} /> 
    </AuthWrapper>
  );
};

export default RouterComponent;

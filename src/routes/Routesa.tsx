import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home";
import AboutPage from "../pages/About";
import Auth from "../pages/auth/auth";
import ManagerAccount from "../pages/admin/ManagerAccount";
import ManageCategories from "../pages/admin/ManageCategories";

const RoutesComponent = () => (
  <Router>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<HomePage />} />

      <Route path="/about" element={<AboutPage />} />
      <Route path="/admin/manage-user" element={<ManagerAccount />} />
      <Route path="/admin/manage-categories" element={<ManageCategories />} />
    </Routes>
  </Router>
);

export default RoutesComponent;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/Home';
import AboutPage from '../pages/About'; 
import Auth from '../pages/auth/auth';
import ManagerAccount from '../pages/admin/ManagerAccount';
const RoutesComponent = () => (
  <Router>
    <Routes>
    <Route path="/auth" element={<Auth />} />
      <Route path="/" element={<HomePage />} />
     
      <Route path="/about" element={<AboutPage />} />
      <Route path="/admin/manage-user" element={<ManagerAccount />} />

    </Routes>
  </Router>
);

export default RoutesComponent;

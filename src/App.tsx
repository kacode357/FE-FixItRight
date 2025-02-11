import { useContext, useEffect } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/auth.context";
import { GetCurrentLogin } from "./services/api";

const App: React.FC = () => {
  const { setAuth, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setAppLoading(true);
        const res = await GetCurrentLogin();

        if (res) {
          setAuth({
            isAuthenticated: true,
            user: {
              id: res?.id,
              imgUrl: res?.Avatar,
              email: res?.IsVerified,
              name: res?.Fullname,
              role: res.Roles[0]
            },
          });
        }
      } catch (error) {
        localStorage.clear();
      
      } finally {
        setAppLoading(false);
      }
    };
    fetchAccount();
  }, [setAuth, setAppLoading]);

  return (
    <Layout>
      {/* Bỏ Loading component */}
      <Outlet />
    </Layout>
  );
};

export default App;

import { useEffect, useState } from "react";
import LoginForm from "../../components/LoginForm";
import RegisterForm from "../../components/RegisterForm";

const Login = () => {
  const [isRegisterActive, setIsRegisterActive] = useState(false);

  useEffect(() => {
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    if (registerBtn && loginBtn && container) {
      const handleRegisterClick = () => {
        setIsRegisterActive(true);
      };

      const handleLoginClick = () => {
        setIsRegisterActive(false);
      };

      registerBtn.addEventListener("click", handleRegisterClick);
      loginBtn.addEventListener("click", handleLoginClick);

      return () => {
        registerBtn.removeEventListener("click", handleRegisterClick);
        loginBtn.removeEventListener("click", handleLoginClick);
      };
    }
  }, []);

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `` }}
    >
      <div
        className={` container ${isRegisterActive ? "active" : ""}`}
        id="container"
      >
        {isRegisterActive ? <RegisterForm /> : <LoginForm />}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left ">
              {/* <button className="button-customize-2" id="login">Sign In</button> */}
            </div>
            <div className="toggle-panel toggle-right">
              {/* <button className="button-customize-2" id="register">Sign Up</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

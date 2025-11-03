import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginFormComponent/LoginForm";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (email: string, password: string) => {
    console.log("Login with:", email, password);
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login");
  };

  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      onSignUpClick={handleSignUpClick}
    />
  );
}

export default Login;
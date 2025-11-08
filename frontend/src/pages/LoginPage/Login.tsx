import { useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import LoginForm from '@components/LoginFormComponent/LoginForm';

function Login() {
  const navigate = useNavigate();
  const { signIn, setActive } = useSignIn();

  const handleLogin = async (email: string, password: string) => {
    if (!signIn) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      const error = err as { errors?: Array<{ message: string }> };
      alert(error.errors?.[0]?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    if (!signIn) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  const handleSignUpClick = () => {
    navigate('/sign-up');
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onSignUpClick={handleSignUpClick}
    />
  );
}

export default Login;
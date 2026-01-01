import { useNavigate } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import { useState } from 'react';
import LoginForm from '@components/LoginFormComponent/LoginForm';

function getClerkErrorMessage(err: any): string {
  if (Array.isArray(err?.errors) && err.errors.length > 0) {
    const e = err.errors[0];
    return e.longMessage || e.message || 'Unable to sign in.';
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Something went wrong. Please try again.';
}

function Login() {
  const navigate = useNavigate();
  const { signIn, setActive } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async (email: string, password: string) => {
    if (!signIn) return;
    setError(null);
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
      setError(getClerkErrorMessage(err));
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

  return (
    <LoginForm
      onSubmit={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onSignUpClick={() => navigate('/sign-up')}
      error={error}
    />
  );
}

export default Login;

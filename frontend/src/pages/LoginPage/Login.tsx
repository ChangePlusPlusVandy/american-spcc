import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginForm from '@components/LoginFormComponent/LoginForm';
import { API_BASE_URL } from '@/config/api';
import { useSignIn, useAuth } from '@clerk/clerk-react';

function getClerkErrorMessage(err: any): string {
  if (Array.isArray(err?.errors) && err.errors.length > 0) {
    const e = err.errors[0];
    return e.longMessage || e.message || 'Unable to sign in.';
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong. Please try again.';
}

export default function Login() {
  const navigate = useNavigate();
  const { signIn, setActive } = useSignIn();
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const redirect = async () => {
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const me = await res.json();

      if (me.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    };

    redirect();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return null;

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
      }
    } catch (err) {
      setError(getClerkErrorMessage(err));
    }
  };

  const handleGoogleLogin = async () => {
    if (!signIn) return;

    await signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/login',
    });
  };

  if (isSignedIn) return null;

  return (
    <LoginForm
      onSubmit={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onSignUpClick={() => navigate('/sign-up')}
      onForgotPassword={() => navigate('/reset-password')}
      error={error}
    />
  );
}

import { useSignIn } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.css';

export default function ResetPassword() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!signIn || !isLoaded) return;

    try {
      setLoading(true);
      setError(null);

      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });

      setStep('reset');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!code || !password) {
      setError('Please fill out all fields.');
      return;
    }
    if (!signIn || !isLoaded) return;

    try {
      setLoading(true);
      setError(null);

      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || 'Invalid code or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Reset Password</h1>

        {error && <p className={styles.error}>{error}</p>}

        {step === 'email' ? (
          <>
            <p className={styles.subtitle}>Enter your email and we’ll send you a reset code.</p>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />

            <button onClick={handleSendCode} disabled={loading} className={styles.primaryButton}>
              {loading ? 'Sending…' : 'Send Code'}
            </button>
          </>
        ) : (
          <>
            <p className={styles.subtitle}>
              Enter the code sent to your email and your new password.
            </p>

            <input
              placeholder="Reset code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={styles.input}
            />

            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className={styles.primaryButton}
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>

            <button onClick={() => setStep('email')} className={styles.linkButton}>
              Resend code
            </button>
          </>
        )}
      </div>
    </div>
  );
}

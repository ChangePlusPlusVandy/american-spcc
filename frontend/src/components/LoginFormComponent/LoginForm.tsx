import { useState } from 'react';
import styles from './LoginForm.module.css';
import InputField, { InputType } from '@components/InputFieldComponent/InputField';
import Button from '@components/ButtonComponent/Button';
import { ButtonColor, ButtonVariant } from '@components/ButtonComponent/ButtonDefinitions';
import americanSPCCLogo from '@assets/AmericanSPCCLogo.png';
import googleLogo from '@assets/GoogleLogo.png';
import loginPageImage from '@assets/SPCC - Login Page.png';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onSignUpClick: () => void;
  onForgotPassword: (email: string) => void;
  error: string | null;
}


function LoginForm({
  onSubmit,
  onGoogleLogin,
  onSignUpClick,
  onForgotPassword,
  error,
}: LoginFormProps) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };
  

  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSection}>
        <img src={loginPageImage} alt="Children in circle" className={styles.loginImage} />
      </div>
      <div className={styles.rightSection}>
        <img src={americanSPCCLogo} alt="American SPCC" className={styles.logo} />
        <div className={styles.formCard}>
          <h1 className={styles.title}>Login</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <InputField
              label="Email"
              type={InputType.Email}
              placeholder="example@mail.com"
              value={email}
              onChange={setEmail}
              name="email"
              required
            />
            <InputField
              label="Password"
              type={InputType.Password}
              placeholder="************"
              value={password}
              onChange={setPassword}
              name="password"
              required
              showPasswordToggle
            />

            <button
              type="button"
              className={styles.forgotPassword}
              onClick={() => onForgotPassword(email)}
            >
              Forgot password?
            </button>


            {error && <p className={styles.fieldError}>{error}</p>}

            <Button
              text="SIGN IN"
              type="submit"
              color={ButtonColor.DarkBlue}
              variant={ButtonVariant.Regular}
            />
          </form>
          <div className={styles.divider}>
            <div className={styles.line} />
            <span className={styles.dividerText}>OR</span>
            <div className={styles.line} />
          </div>
          <button type="button" className={styles.googleButton} onClick={onGoogleLogin}>
            <img src={googleLogo} alt="Google" className={styles.googleIcon} />
          </button>
          <div className={styles.signUpSection}>
            <span className={styles.signUpText}>Don't have an account? </span>
            <button type="button" className={styles.signUpLink} onClick={onSignUpClick}>
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

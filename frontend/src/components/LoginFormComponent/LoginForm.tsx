import { useState } from "react";
import styles from "./LoginForm.module.css";
import { type LoginFormProps } from "./LoginFormDefinitions";
import InputField from "../InputFieldComponent/InputField";
import { InputType } from "../InputFieldComponent/InputFieldDefinitions";
import Button from "../ButtonComponent/Button";
import { ButtonColor, ButtonVariant } from "../ButtonComponent/ButtonDefinitions";
import SocialLoginButton from "../SocialLoginButtonComponent/SocialLoginButton";
import { SocialProvider } from "../SocialLoginButtonComponent/SocialLoginButtonDefinitions";
import Divider from "../DividerComponent/Divider";

function LoginForm({
  onSubmit,
  onGoogleLogin,
  onFacebookLogin,
  onSignUpClick,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className={styles.loginContainer}>
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

          <Button
            text="SIGN IN"
            type="submit"
            color={ButtonColor.DarkBlue}
            variant={ButtonVariant.Regular}
          />
        </form>

        <Divider text="OR" />

        <div className={styles.socialButtons}>
          <SocialLoginButton
            provider={SocialProvider.Google}
            onClick={onGoogleLogin}
          />
          <SocialLoginButton
            provider={SocialProvider.Facebook}
            onClick={onFacebookLogin}
          />
        </div>

        <div className={styles.signUpSection}>
          <span className={styles.signUpText}>Don't have an account? </span>
          <button
            type="button"
            className={styles.signUpLink}
            onClick={onSignUpClick}
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

export interface LoginFormProps {
    onSubmit: (email: string, password: string) => void;
    onGoogleLogin: () => void;
    onSignUpClick: () => void;
  }
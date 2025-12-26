export interface SignupFormProps {
    step: 1 | 2 | 3;
    email: string;
    password: string;
    setEmail: (v: string) => void;
    setPassword: (v: string) => void;
    onNext: () => void;
    onGoogleSignup: () => void;
    onSignInClick: () => void;
  }
  
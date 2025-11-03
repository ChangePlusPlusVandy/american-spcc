/**
 * LoginForm component type definitions
 *
 * Defines the interface (props) for the LoginForm component.
 * Specifies what props LoginForm accepts.
 */
export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  onFacebookLogin: () => void;
  onSignUpClick: () => void;
}

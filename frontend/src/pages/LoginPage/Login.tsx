import { SignIn } from '@clerk/clerk-react';

function Login() {
  return (
    <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center' }}>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}

export default Login;

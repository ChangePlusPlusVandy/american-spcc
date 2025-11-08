import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

function Landing() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Landing Page</h1>
      <SignedOut>
        <p>You are signed out</p>
        <Link to="/sign-in">Sign In</Link>
      </SignedOut>
      <SignedIn>
        <p>You are signed in!</p>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default Landing;

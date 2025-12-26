import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

export function OnboardingGuard({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;
  if (!user) return <Navigate to="/sign-in" replace />;

  const complete = user.unsafeMetadata?.onboarding_complete === true;

  if (!complete) {
    return <Navigate to="/sign-up?step=2" replace />;
  }

  return <>{children}</>;
}

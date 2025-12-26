import { useSignUp, useUser, useClerk } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SignupForm from '@/components/SignupFormComponent/SignupForm';
import { useEffect } from 'react';


type Step = 1 | 2 | 3;


const RELATIONSHIP_OPTIONS = [
  { label: 'Mother', value: 'MOTHER' },
  { label: 'Father', value: 'FATHER' },
  { label: 'Guardian', value: 'GUARDIAN' },
  { label: 'Grandparent', value: 'GRANDPARENT' },
  { label: 'Other', value: 'OTHER' },
  { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' },
] as const;

const HOUSEHOLD_OPTIONS = [
  { label: 'Married', value: 'MARRIED' },
  { label: 'Single parent', value: 'SINGLE_PARENT' },
  { label: 'Divorced / separated', value: 'DIVORCED_SEPARATED' },
  { label: 'Widowed', value: 'WIDOWED' },
  { label: 'Other', value: 'OTHER' },
  { label: 'Prefer not to say', value: 'PREFER_NOT_TO_SAY' },
] as const;

export default function SignUp() {
  const { signUp, isLoaded } = useSignUp();
  const { user } = useUser();
  const { setActive } = useClerk();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


  const stepParam = Number(searchParams.get('step'));
  const initialStep: Step = stepParam === 2 || stepParam === 3 ? stepParam : 1;
  const [step, setStep] = useState<Step>(initialStep);


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasSynced, setHasSynced] = useState(false);
  const [relationship, setRelationship] = useState('');
  const [householdType, setHouseholdType] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);

  const goToStep = (next: Step) => {
    setStep(next);
    navigate(`/sign-up?step=${next}`, { replace: true });
  };

useEffect(() => {
  if (!user || hasSynced) return;

  const syncUser = async () => {
    try {
      await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        credentials: 'include',
      });
      setHasSynced(true);
    } catch (err) {
      console.error('Failed to sync user to DB', err);
    }
  };

  syncUser();
}, [user, hasSynced]);




  const handleEmailSignup = async () => {
    if (!isLoaded || !signUp) return;

    const result = await signUp.create({
      emailAddress: email,
      password,
    });

    if (result.status !== 'complete') {
      alert('Signup incomplete');
      return;
    }

    await setActive({ session: result.createdSessionId });

    const response = await fetch('http://localhost:8000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to create DB user');
      return;
    }

    goToStep(2);
  };

  const handleCompleteSignup = async () => {
    if (!user) return;

    const response = await fetch('http://localhost:8000/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        relationship,
        household_type: householdType,
        topics_of_interest: topics,
        kids_age_groups: ageGroups,
        subscribed_newsletter: subscribeNewsletter,
        onboarding_complete: true,
      }),
    });

    if (!response.ok) {
      console.error('Failed to update user in DB');
      return;
    }

    await user.update({
      unsafeMetadata: {
        onboarding_complete: true,
      },
    });

    navigate('/');
  };


  return (
    <SignupForm
      step={step}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      onNext={handleEmailSignup}
      onGoogleSignup={() =>
        signUp?.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/sign-up?step=2',
        })
      }
      onSignInClick={() => navigate('/sign-in')}
      relationship={relationship}
      householdType={householdType}
      setRelationship={setRelationship}
      setHouseholdType={setHouseholdType}
      relationshipOptions={RELATIONSHIP_OPTIONS}
      householdOptions={HOUSEHOLD_OPTIONS}
      goToStep3={() => goToStep(3)}
      topics={topics}
      setTopics={setTopics}
      ageGroups={ageGroups}
      setAgeGroups={setAgeGroups}
      subscribeNewsletter={subscribeNewsletter}
      setSubscribeNewsletter={setSubscribeNewsletter}
      onComplete={handleCompleteSignup}
    />
  );
}

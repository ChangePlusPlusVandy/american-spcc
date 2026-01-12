import { useSignUp, useUser, useClerk } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SignupForm from '@/components/SignupFormComponent/SignupForm';
import { useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';
import { useAuth } from '@clerk/clerk-react';

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
  console.log('API_BASE_URL:', API_BASE_URL);
  const { signUp, isLoaded } = useSignUp();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { setActive } = useClerk();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const stepParam = Number(searchParams.get('step'));
  const initialStep: Step = stepParam === 2 || stepParam === 3 ? stepParam : 1;
  const [step, setStep] = useState<Step>(initialStep);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);  
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
    const stepParam = Number(searchParams.get('step'));
    if (stepParam === 1 || stepParam === 2 || stepParam === 3) {
      setStep(stepParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user || step !== 2 || hasSynced) return;
  
    const syncUser = async () => {
      const token = await getToken();

      await fetch(`${API_BASE_URL}/api/auth/sync-user`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      
  
      setHasSynced(true);
    };
  
    syncUser();
  }, [user, step, hasSynced, getToken]);

  
  
  
  const handleEmailSignup = async () => {
    if (!isLoaded || !signUp || processing) return;
    setProcessing(true);
    setEmailError(null);
    setPasswordError(null);
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });
      if (result.status !== 'complete') return;
      await setActive({ session: result.createdSessionId });

      if (!hasSynced && user) {
        const token = await getToken();

        await fetch(`${API_BASE_URL}/api/auth/sync-user`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        
        
        
      
        setHasSynced(true);
      }
      
      
      
      navigate('/sign-up?step=2', { replace: true });
      
    } catch (err: any) {
      if (!Array.isArray(err?.errors)) {
        setPasswordError('Something went wrong. Please try again.');
        return;
      }
      for (const e of err.errors) {
        const message = e.longMessage || e.message;
        if (
          e.code.startsWith('form_identifier') ||
          e.code.startsWith('form_param') ||
          e.code === 'form_email_invalid'
        ) {
          setEmailError(message);
        }
        if (e.code.startsWith('form_password')) {
          setPasswordError(message);
        }
      }
    } finally {
      setProcessing(false);
    }
  };
  
  const handleCompleteSignup = async () => {
    if (!user || processing) return;
    setProcessing(true);
  
    try {
      const token = await getToken(); // ✅ REQUIRED
  
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // ✅ REQUIRED
        },
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
        throw new Error('Failed to update user');
      }
  
      await user.update({
        unsafeMetadata: {
          onboarding_complete: true,
        },
      });
  
      navigate('/');
    } finally {
      setProcessing(false);
    }
  };
  

  return (
    <SignupForm
      step={step}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      emailError={emailError}
      passwordError={passwordError}
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
      processing={processing}
    />
  );
}
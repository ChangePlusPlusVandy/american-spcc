import InputField, { InputType } from '@components/InputFieldComponent/InputField';
import Button from '@components/ButtonComponent/Button';
import { ButtonColor, ButtonVariant } from '@components/ButtonComponent/ButtonDefinitions';

import americanSPCCLogo from '@assets/AmericanSPCCLogo.png';
import signupPageImage from '@assets/SPCC - Sign Up Page.png';
import googleLogo from '@assets/GoogleLogo.png';

import styles from './SignupForm.module.css';

type SelectOption = {
  label: string;
  value: string;
};

interface SignupFormProps {
  step: 1 | 2 | 3;
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  emailError: string | null;
  passwordError: string | null;
  onNext: () => void;
  onGoogleSignup: () => void;
  onSignInClick: () => void;
  googleLoading?: boolean;
  relationship: string;
  householdType: string;
  setRelationship: (v: string) => void;
  setHouseholdType: (v: string) => void;
  relationshipOptions: readonly SelectOption[];
  householdOptions: readonly SelectOption[];
  goToStep3: () => void;
  onSkipStep2: () => void;
  topics: string[];
  setTopics: (v: string[]) => void;
  ageGroups: string[];
  setAgeGroups: (v: string[]) => void;
  subscribeNewsletter: boolean;
  setSubscribeNewsletter: (v: boolean) => void;
  onComplete: () => void;
  processing: boolean;
}

export default function SignupForm({
  step,
  email,
  password,
  setEmail,
  setPassword,
  emailError,
  passwordError,
  onNext,
  onGoogleSignup,
  onSignInClick,
  googleLoading = false,
  relationship,
  householdType,
  setRelationship,
  setHouseholdType,
  relationshipOptions,
  householdOptions,
  goToStep3,
  onSkipStep2,
  topics,
  setTopics,
  ageGroups,
  setAgeGroups,
  subscribeNewsletter,
  setSubscribeNewsletter,
  onComplete,
  processing,
}: SignupFormProps) {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.leftSection}>
        <img src={signupPageImage} className={styles.loginImage} />
      </div>
      <div className={styles.rightSection}>
        <img src={americanSPCCLogo} className={styles.logo} />
        <div className={styles.formCard}>
          <h1 className={styles.title}>Create Your Account</h1>
          <div className={styles.stepper}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.stepItem}>
                <div className={`${styles.stepCircle} ${step >= n ? styles.active : ''}`}>{n}</div>
                <span className={step >= n ? styles.activeLabel : ''}>
                  {n === 1 ? 'Create' : n === 2 ? 'Personalization' : 'Complete'}
                </span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <form className={styles.form}>
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
              {(emailError || passwordError) && (
                <p className={styles.fieldError}>
                  {emailError ?? passwordError}
                </p>
              )}
              <Button
                type="button"
                disabled={processing}
                onClick={onNext}
                color={ButtonColor.DarkBlue}
                variant={ButtonVariant.Regular}
              >
                {processing ? (
                  <span className={styles.processingContent}>
                    <span className={styles.buttonSpinner} />
                    Processing…
                  </span>
                ) : (
                  'NEXT'
                )}
              </Button>
              </form>
              <div className={styles.divider}>
                <div className={styles.line} />
                <span className={styles.dividerText}>OR</span>
                <div className={styles.line} />
              </div>
              <button
                type="button"
                className={styles.googleButton}
                onClick={onGoogleSignup}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <div className={styles.spinner} />
                ) : (
                  <img src={googleLogo} className={styles.googleIcon} />
                )}
              </button>
              <div className={styles.signUpSection}>
                <span className={styles.signUpText}>Already have an account? </span>
                <button className={styles.signUpLink} onClick={onSignInClick}>
                  SIGN IN
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className={styles.form}>
              <p className={styles.sectionTitle}>Which best describes you?</p>
              <div className={styles.choiceGrid}>
                {relationshipOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.choiceButton} ${
                      relationship === opt.value ? styles.selected : ''
                    }`}
                    onClick={() =>
                      setRelationship(relationship === opt.value ? '' : opt.value)
                    }                    
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className={styles.sectionTitle}>Household Type</p>
              <div className={styles.choiceGrid}>
                {householdOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.choiceButton} ${
                      householdType === opt.value ? styles.selected : ''
                    }`}
                    onClick={() =>
                      setHouseholdType(householdType === opt.value ? '' : opt.value)
                    }
                    
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className={styles.actions}>
              <Button
                type="button"
                onClick={goToStep3}
                color={ButtonColor.DarkBlue}
                variant={ButtonVariant.Regular}
              >
                Next
              </Button>
              <button className={styles.skip} onClick={onSkipStep2} type="button">
                Skip
              </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.form}>
              <p className={styles.sectionTitle}>Topics of Interest</p>
              <div className={styles.choiceGrid}>
                {[
                  { label: 'Safety & Protection', value: 'SAFETY_PROTECTION' },
                  { label: 'Life Skills & Independence', value: 'LIFE_SKILLS_INDEPENDENCE' },
                  { label: 'Health & Wellbeing', value: 'HEALTH_WELLBEING' },
                  { label: 'Child Development', value: 'CHILD_DEVELOPMENT' },
                  { label: 'Mental & Emotional Health', value: 'MENTAL_EMOTIONAL_HEALTH' },
                  { label: 'Education & Learning', value: 'EDUCATION_LEARNING' },
                  { label: 'Family Support & Community', value: 'FAMILY_SUPPORT_COMMUNITY' },
                  {
                    label: 'Parenting Skills & Relationships',
                    value: 'PARENTING_SKILLS_RELATIONSHIPS',
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.choiceButton} ${
                      topics.includes(opt.value) ? styles.selected : ''
                    }`}
                    onClick={() =>
                      setTopics(
                        topics.includes(opt.value)
                          ? topics.filter((t) => t !== opt.value)
                          : [...topics, opt.value]
                      )
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className={styles.sectionTitle}>Your Kids’ Age Group(s)</p>
              <div className={styles.choiceGrid}>
                {[
                  { label: 'Ages 0–3', value: 'AGE_0_3' },
                  { label: 'Ages 4–6', value: 'AGE_4_6' },
                  { label: 'Ages 7–10', value: 'AGE_7_10' },
                  { label: 'Ages 10–13', value: 'AGE_10_13' },
                  { label: 'Ages 14–18', value: 'AGE_14_18' },
                  { label: '18+', value: 'AGE_18_ABOVE' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.choiceButton} ${
                      ageGroups.includes(opt.value) ? styles.selected : ''
                    }`}
                    onClick={() =>
                      setAgeGroups(
                        ageGroups.includes(opt.value)
                          ? ageGroups.filter((a) => a !== opt.value)
                          : [...ageGroups, opt.value]
                      )
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                />
                <span>Subscribe to Newsletter?</span>
              </label>
              <div className={styles.actions}>
              <Button
                type="button"
                disabled={processing}
                onClick={onComplete}
                color={ButtonColor.DarkBlue}
                variant={ButtonVariant.Regular}
              >
                {processing ? (
                  <span className={styles.processingContent}>
                    <span className={styles.buttonSpinner} />
                    Processing…
                  </span>
                ) : (
                  'DONE'
                )}
              </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import styles from './InputField.module.css';
import { type InputFieldProps, InputType } from './InputFieldDefinitions';
import eyeIcon from '@assets/eye.png';
import eyeOpenIcon from '@assets/eye-open.svg';

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  name,
  required = false,
  showPasswordToggle = false,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === InputType.Password && showPassword ? InputType.Text : type;

  return (
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          className={styles.input}
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
        {showPasswordToggle && type === InputType.Password && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <img
              src={showPassword ? eyeOpenIcon : eyeIcon}
              alt={showPassword ? 'Hide password' : 'Show password'}
              className={styles.eyeIcon}
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default InputField;

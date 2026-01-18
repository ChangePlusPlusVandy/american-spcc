import { useState } from 'react';
import styles from './InputField.module.css';
import eyeIcon from '@assets/eye.png';
import eyeOpenIcon from '@assets/eye-open.svg';

export interface InputFieldProps {
  label: string;
  type: InputType;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  name: string;
  required?: boolean;
  showPasswordToggle?: boolean;
}

export enum InputType {
  Text = 'text',
  Email = 'email',
  Password = 'password',
}

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

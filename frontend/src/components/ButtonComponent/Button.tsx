/**
 * Button component implementation
 *
 * Renders a reusable button with customizable text, color, variant, and behavior.
 * Uses props from Button.definitions.ts and applies appropriate CSS styles.
 */
import styles from './Button.module.css';
import { type ButtonProps, ButtonVariant, ButtonColor } from './ButtonDefinitions';

// Reusable Button component
function Button({
  text,
  variant = ButtonVariant.Regular,
  color = ButtonColor.Grey,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  // Combine CSS classes
  const buttonClassName = `${styles.button} ${styles[variant]} ${styles[color]}`;

  return (
    <button className={buttonClassName} onClick={onClick} type={type} disabled={disabled}>
      {text}
    </button>
  );
}

export default Button;

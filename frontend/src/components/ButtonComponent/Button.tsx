import styles from './Button.module.css';
import { type ButtonProps, ButtonVariant, ButtonColor } from './ButtonDefinitions';

function Button({
  text,
  children,
  variant = ButtonVariant.Regular,
  color = ButtonColor.Grey,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const buttonClassName = `${styles.button} ${styles[variant]} ${styles[color]}`;

  return (
    <button
      className={buttonClassName}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children ?? text}
    </button>
  );
}


export default Button;

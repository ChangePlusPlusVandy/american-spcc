import styles from './Button.module.css';
export interface ButtonProps {
  text?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: React.ReactNode;
}


export enum ButtonVariant {
  Regular = 'regular',
  Small = 'small',
}


export enum ButtonColor {
  Grey = 'grey',
  DarkBlue = 'darkBlue',
  Teal = 'teal',
}

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

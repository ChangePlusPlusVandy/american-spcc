import styles from "./Button.module.css";
import { type ButtonProps, ButtonVariant, ButtonColor } from "./ButtonDefinitions";

function Button({ 
  text, 
  variant = ButtonVariant.Regular, 
  color = ButtonColor.Grey,        
  onClick, 
  type = "button", 
  disabled = false 
}: ButtonProps) {
  
  const buttonClassName = `${styles.button} ${styles[variant]} ${styles[color]}`;
  
  return (
    <button 
      className={buttonClassName}
      onClick={onClick} 
      type={type}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
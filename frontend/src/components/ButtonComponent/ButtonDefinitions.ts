/**
 * Button component type definitions
 *
 * Defines the interface (props) and enums (allowed values) for the Button component.
 * Specifies what props Button accepts and what values are valid for each prop.
 */
export interface ButtonProps {
  text: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export enum ButtonVariant {
  Regular = 'regular',
  // Add more variants here as you discover what you need
}

export enum ButtonColor {
  Grey = 'grey',
  // Add more colors here as you discover what you need
}

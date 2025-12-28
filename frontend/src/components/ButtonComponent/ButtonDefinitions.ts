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

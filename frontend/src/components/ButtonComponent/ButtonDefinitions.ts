export interface ButtonProps {
    text: string;
    variant?: ButtonVariant;
    color?: ButtonColor;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }

  export enum ButtonVariant {
    Regular = "regular",
  }

  export enum ButtonColor {
    Grey = "grey",
    DarkBlue = "darkBlue",
  }
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
  Text = "text",
  Email = "email",
  Password = "password",
}

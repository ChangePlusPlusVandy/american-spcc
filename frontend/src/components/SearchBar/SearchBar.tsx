import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  // Customization props with defaults
  size?: 'small' | 'medium' | 'large';
  borderColor?: string;
  borderWidth?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
}

function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  size = 'large',
  borderColor = '#55C3C0',
  borderWidth = '5px',
  backgroundColor = '#FFF9F0',
  textColor = '#566273',
  fontSize,
}: SearchBarProps) {
  // Calculate dimensions based on size
  const sizeStyles = {
    small: { height: '50px', padding: '12px 20px', fontSize: '14px' },
    medium: { height: '70px', padding: '20px 30px', fontSize: '16px' },
    large: { height: '10vh', padding: '35.5px', fontSize: '20px' },
  };

  const styles = sizeStyles[size];

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mx-auto w-full rounded-full focus:outline-none shadow-[0px_4px_4px_0px_#00000040] placeholder:text-black placeholder:font-bold"
      placeholder={placeholder}
      style={{
        border: `${borderWidth} solid ${borderColor}`,
        backgroundColor: backgroundColor,
        color: textColor,
        height: styles.height,
        padding: styles.padding,
        fontSize: fontSize || styles.fontSize,
      }}
    />
  );
}

export default SearchBar;

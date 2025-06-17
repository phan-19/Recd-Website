import React from 'react';
import './Button.css';

type ButtonProps = {
  buttonStyle: string;
  buttonText: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Button: React.FC<ButtonProps> = ({ buttonStyle, buttonText, onClick}) => {
  return (
    <button className={buttonStyle} onClick={onClick}>
      {buttonText}
    </button>
  );
};

export default Button;
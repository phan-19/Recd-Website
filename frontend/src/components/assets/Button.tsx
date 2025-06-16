import React from 'react';

type ButtonProps = {
  buttonText: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ buttonText, onClick, disabled }) => {

  const buttonStyle = {
    backgroundColor: "#366b4b",
    color: "white",
    padding: "10px",
    margin: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1.25rem"
  };

  return (
    <button style={buttonStyle} onClick={onClick} disabled={disabled}>
      {buttonText}
    </button>
  );
};

export default Button;
import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled }) => {
  const buttonStyles =
    "rounded-lg w-full bg-black p-4  text-lg font-semibold text-white shadow-sm hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-700";

  return (
    <button className={buttonStyles} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;

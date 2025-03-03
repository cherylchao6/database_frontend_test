import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  inputClassName?: string; // Optional prop for extending class names
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  inputClassName = "",
  disabled = false,
  ...props
}) => {
  const baseClassName =
    "pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  const disabledClassName = disabled
    ? "bg-gray-100 cursor-not-allowed text-gray-500" // 背景改灰色，文字變淡
    : "";

  return (
    <div>
      {label && (
        <label className="block font-medium leading-6 text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        className={`${baseClassName} ${disabledClassName} ${inputClassName}`}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

export default FormInput;

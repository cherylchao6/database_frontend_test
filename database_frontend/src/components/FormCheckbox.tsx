import React from "react";

interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked?: boolean;
  inputClassName?: string; // Optional prop for extending class names
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  label,
  inputClassName = "",
  checked = false,
  ...props
}) => {
  const baseClassName =
    "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600";

  return (
    <div className="flex items-center">
      {label && (
        <label className="block text-m font-medium leading-6 text-gray-900 mr-2">
          {label}
        </label>
      )}
      <input
        type="checkbox"
        checked={checked}
        className={`${baseClassName} ${inputClassName}`}
        {...props}
      />
    </div>
  );
};

export default FormCheckbox;

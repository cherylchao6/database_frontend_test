import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  inputClassName?: string; // Optional prop for extending class names
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  inputClassName = "",
  required,
  ...props
}) => {
  const baseClassName =
    "dark:text-white pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6";

  return (
    <div>
      {label && (
        <label className="block font-medium leading-6 text-gray-900 mb-2 dark:text-white">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input className={`${baseClassName} ${inputClassName}`} {...props} />
    </div>
  );
};

export default FormInput;

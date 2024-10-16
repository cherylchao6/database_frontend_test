import React from "react";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  selectClassName?: string; // Optional prop for extending class names
  options: string[]; // The array of options to display
  value?: string; // The selected value
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  selectClassName = "",
  options,
<<<<<<< HEAD
  required,
=======
  value,
>>>>>>> origin/main
  ...props
}) => {
  const baseClassName =
    "dark:text-white pl-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  return (
    <div>
      {label && (
        <label className="block font-medium leading-6 text-gray-900 mb-2 dark:text-white">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        className={`${baseClassName} ${selectClassName}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;

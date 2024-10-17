import React from "react";

// Convert to 'YYYY-MM-DD' format
const formatTimestamp = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};

interface FormDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  // Optional prop for extending class names
  inputClassName?: string;
}

const FormDate: React.FC<FormDateProps> = ({
  label,
  inputClassName = "",
  value,
  ...props
}) => {
  const baseClassName =
    "pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

  // Use formatting function if provided, otherwise use the value directly
  const formattedValue = value ? formatTimestamp(value) : "";

  return (
    <div>
      {label && (
        <label className="block font-medium leading-6 text-gray-900 mb-2">
          {label}
        </label>
      )}
      <input
        type="date"
        className={`${baseClassName} ${inputClassName}`}
        value={formattedValue}
        {...props}
      />
    </div>
  );
};

export default FormDate;

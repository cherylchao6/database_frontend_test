import React from "react";

interface MultipleCheckboxProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

const FormMultipleCheckbox: React.FC<MultipleCheckboxProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  const handleCheckboxChange = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((selected) => selected !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div>
      {label && (
        <label className="block font-medium leading-6 text-gray-900 mb-2">
          {label}
        </label>
      )}
      {options.map((option) => (
        <div key={option} className="flex items-center mb-2">
          <input
            type="checkbox"
            id={option}
            checked={selectedValues.includes(option)}
            onChange={() => handleCheckboxChange(option)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
          <label
            htmlFor={option}
            className="ml-2 block text-sm font-medium text-gray-900"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  );
};

export default FormMultipleCheckbox;

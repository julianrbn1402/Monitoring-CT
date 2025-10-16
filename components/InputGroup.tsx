import React from 'react';

interface InputGroupProps {
  label: string;
  id: string;
  unit: string;
  value: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isReadOnly?: boolean;
  placeholder?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  id,
  unit,
  value,
  onChange,
  isReadOnly = false,
  placeholder = '0',
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          readOnly={isReadOnly}
          placeholder={placeholder}
          className={`w-full py-2 pl-3 pr-16 rounded-md shadow-sm text-slate-900 focus:ring-indigo-500 focus:border-indigo-500 transition
            ${isReadOnly 
              ? 'bg-slate-200/80 border-slate-300 cursor-not-allowed' 
              : 'bg-white/80 border-slate-300 hover:border-indigo-400'
            } border`}
          min="0"
          step="any"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default InputGroup;
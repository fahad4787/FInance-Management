import { FiChevronDown } from 'react-icons/fi';

const DropdownField = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select...",
  className = "",
  hideLabel = false
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && !hideLabel && (
        <label className="text-sm font-semibold mb-2.5 text-gray-700 capitalize tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          value={value}
          onChange={onChange}
          className="w-full h-11 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 appearance-none bg-white pr-10 cursor-pointer text-gray-700 text-sm"
        >
          <option value="" className="text-gray-400">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default DropdownField;

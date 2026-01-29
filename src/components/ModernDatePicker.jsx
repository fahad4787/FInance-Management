import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { FiCalendar } from 'react-icons/fi';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <FiCalendar className="w-5 h-5 text-gray-400" />
      </div>
      <input
        ref={ref}
        onClick={onClick}
        value={value}
        readOnly
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 bg-white cursor-pointer text-gray-700 placeholder:text-gray-400"
      />
    </div>
  );
});

CustomInput.displayName = 'CustomInput';

const ModernDatePicker = ({ label, value, onChange, placeholder = 'Select date', className = '' }) => {
  const selectedDate = value ? new Date(value) : null;

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-semibold mb-2.5 text-gray-700 capitalize tracking-wide">
        {label}
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => onChange(date ? date.toISOString().slice(0, 10) : '')}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        customInput={<CustomInput placeholder={placeholder} />}
        wrapperClassName="w-full"
      />
    </div>
  );
};

export default ModernDatePicker;


import { useState, useRef, useEffect, useMemo } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const SearchableDropdown = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Type or select...",
  leftIcon = null,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (searchTerm === '') {
      return options;
    }
    return options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm('');
  };

  const handleSelectOption = (option) => {
    onChange(option);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }, 200);
  };

  return (
    <div className={`flex flex-col relative ${className}`} ref={dropdownRef}>
      <label className="text-sm font-semibold mb-2.5 text-slate-700 capitalize tracking-wide">
        {label}
      </label>
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : (value || '')}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white pr-10 ${leftIcon ? 'pl-10' : ''}`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FiChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-panel max-h-60 overflow-auto top-full py-1">
          {placeholder.includes('All') && (
            <button
              type="button"
              onClick={handleClear}
              className="w-full text-left px-4 py-2.5 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-200 font-semibold"
            >
              All
            </button>
          )}
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectOption(option)}
              className="w-full text-left px-4 py-2.5 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-slate-100 last:border-b-0"
            >
              {option}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default SearchableDropdown;

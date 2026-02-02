import { useEffect, useMemo, useRef } from 'react';

const ModernDatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  className = ''
}) => {
  const wrapperRef = useRef(null);
  const inputId = useMemo(() => `ts-date-input-${crypto.randomUUID()}`, []);

  useEffect(() => {
    const picker = wrapperRef.current?.querySelector?.('ts-date-picker');
    if (!picker) return;

    const input = picker.querySelector('input');
    if (!input) return;

    const syncValue = (newVal) => {
      if (newVal !== undefined && newVal !== null && newVal !== '') {
        input.value = newVal;
        input.setAttribute('value', newVal);
      } else {
        input.value = '';
        input.removeAttribute('value');
      }
    };

    syncValue(value);

    const handleInput = (e) => {
      const val = e.target.value;
      onChange?.(val || '');
    };

    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleInput);

    return () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('change', handleInput);
    };
  }, [value, onChange]);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold mb-2.5 text-gray-700 capitalize tracking-wide"
        >
          {label}
        </label>
      )}
      <div ref={wrapperRef}>
        <ts-date-picker yearspan="30">
        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          defaultValue={value || ''}
          data-value={value || ''}
        />
        </ts-date-picker>
      </div>
    </div>
  );
};

export default ModernDatePicker;

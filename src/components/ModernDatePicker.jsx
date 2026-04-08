import { useEffect, useMemo, useRef } from 'react';

/** Full date for ts-date-picker. Month mode: parent `YYYY-MM` → first day of month. */
const toPickerDisplayValue = (value, granularity) => {
  const v = typeof value === 'string' ? value.trim() : '';
  if (!v) return '';
  if (granularity === 'month') {
    if (/^\d{4}-\d{2}$/.test(v)) return `${v}-01`;
    if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
    return '';
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  return v;
};

/** Map picker output to parent: month mode emits `YYYY-MM`. */
const fromPickerToModel = (raw, granularity) => {
  const val = typeof raw === 'string' ? raw.trim() : '';
  if (!val) return '';
  const ymd = val.length >= 10 ? val.slice(0, 10) : val;
  if (granularity === 'month') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd.slice(0, 7);
    if (/^\d{4}-\d{2}$/.test(val)) return val;
    return '';
  }
  return ymd.length >= 10 ? ymd : val;
};

const ModernDatePicker = ({
  label,
  value,
  onChange,
  placeholder = 'YYYY-MM-DD',
  className = '',
  granularity = 'day'
}) => {
  const wrapperRef = useRef(null);
  const inputId = useMemo(() => `ts-date-input-${crypto.randomUUID()}`, []);

  const displayValue = useMemo(
    () => toPickerDisplayValue(value, granularity),
    [value, granularity]
  );

  const resolvedPlaceholder =
    granularity === 'month' && placeholder === 'YYYY-MM-DD' ? 'YYYY-MM' : placeholder;

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

    syncValue(displayValue);

    const handleInput = (e) => {
      const val = e.target.value;
      onChange?.(fromPickerToModel(val, granularity));
    };

    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleInput);

    return () => {
      input.removeEventListener('input', handleInput);
      input.removeEventListener('change', handleInput);
    };
  }, [displayValue, onChange, granularity]);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold mb-2.5 text-slate-700 capitalize tracking-wide"
        >
          {label}
        </label>
      )}
      <div ref={wrapperRef}>
        <ts-date-picker yearspan="30">
          <input
            id={inputId}
            type="text"
            placeholder={resolvedPlaceholder}
            defaultValue={displayValue || ''}
            data-value={displayValue || ''}
          />
        </ts-date-picker>
      </div>
    </div>
  );
};

export default ModernDatePicker;

"use client";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}) => (
  <label className={`flex items-center gap-2 cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
          ${checked
            ? "bg-brand-500 border-brand-500"
            : "bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-600"
          }`}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
    {label && (
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    )}
  </label>
);

export default Checkbox;

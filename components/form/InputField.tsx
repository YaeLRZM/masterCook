"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...args: Parameters<typeof clsx>) {
  return twMerge(clsx(...args));
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  hint?: string;
  success?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ error, hint, success, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition",
            "dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30",
            "focus:ring-3 focus:ring-brand-500/10",
            error
              ? "border-error-400 focus:border-error-400 dark:border-error-400"
              : success
              ? "border-success-400 focus:border-success-400 dark:border-success-400"
              : "border-gray-200 focus:border-brand-300 dark:border-gray-700 dark:focus:border-brand-600",
            props.disabled && "cursor-not-allowed opacity-60 bg-gray-50 dark:bg-gray-800",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;

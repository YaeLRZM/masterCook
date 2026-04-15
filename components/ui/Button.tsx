import { ReactNode, ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "ghost" | "danger";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  loading = false,
  disabled,
  className,
  ...rest
}) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-3.5 text-base",
  };

  const variantClasses = {
    primary: "bg-brand-500 text-white shadow-sm hover:bg-brand-600 disabled:bg-brand-300",
    outline: "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
    danger: "bg-error-500 text-white hover:bg-error-600 disabled:bg-error-300",
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
        sizeClasses[size],
        variantClasses[variant],
        (disabled || loading) && "cursor-not-allowed opacity-50",
        className
      )}
      {...rest}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : startIcon ? (
        <span className="flex items-center">{startIcon}</span>
      ) : null}
      {children}
      {!loading && endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;

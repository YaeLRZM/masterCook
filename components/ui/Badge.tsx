import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
  className,
}) => {
  const sizeStyles = { sm: "text-xs px-2 py-0.5", md: "text-sm px-2.5 py-0.5" };

  const variants: Record<BadgeVariant, Record<BadgeColor, string>> = {
    light: {
      primary: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
      success: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",
      error:   "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
      warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-orange-400",
      info:    "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
      light:   "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80",
      dark:    "bg-gray-700 text-white dark:bg-white/5 dark:text-white",
    },
    solid: {
      primary: "bg-brand-500 text-white",
      success: "bg-success-500 text-white",
      error:   "bg-error-500 text-white",
      warning: "bg-warning-500 text-white",
      info:    "bg-blue-500 text-white",
      light:   "bg-gray-400 text-white",
      dark:    "bg-gray-700 text-white",
    },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        sizeStyles[size],
        variants[variant][color],
        className
      )}
    >
      {startIcon && <span>{startIcon}</span>}
      {children}
      {endIcon && <span>{endIcon}</span>}
    </span>
  );
};

export default Badge;

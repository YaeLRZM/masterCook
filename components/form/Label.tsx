import { ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children, htmlFor, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
  >
    {children}
  </label>
);

export default Label;

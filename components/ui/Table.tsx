import { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...args: Parameters<typeof clsx>) {
  return twMerge(clsx(...args));
}

export const Table = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
    <table className={cn("min-w-full divide-y divide-gray-200 dark:divide-gray-800", className)}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
  <thead className={cn("bg-gray-50 dark:bg-gray-800/60", className)}>{children}</thead>
);

export const TableBody = ({ children, className }: { children: ReactNode; className?: string }) => (
  <tbody className={cn("divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900", className)}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <tr className={cn("hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors", className)}>
    {children}
  </tr>
);

export const TableCell = ({
  children,
  isHeader = false,
  className,
}: {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}) => {
  const Tag = isHeader ? "th" : "td";
  return (
    <Tag
      className={cn(
        "px-4 py-3 text-left text-sm",
        isHeader
          ? "font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs"
          : "text-gray-800 dark:text-gray-200",
        className
      )}
    >
      {children}
    </Tag>
  );
};

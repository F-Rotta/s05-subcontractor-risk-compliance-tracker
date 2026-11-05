import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
}

const badgeVariantStyles: Record<string, string> = {
  default:
    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 bg-blue-600 text-white",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 bg-red-600 text-white",
  outline: "text-foreground border border-gray-300 dark:border-gray-700",
  success:
    "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  warning:
    "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

export function badgeVariants({
  variant = "default",
  className = "",
}: {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning";
  className?: string;
} = {}): string {
  return [
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    badgeVariantStyles[variant] || badgeVariantStyles.default,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={badgeVariants({ variant, className })}
      {...props}
    />
  );
}

export { Badge };

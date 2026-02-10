import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "bio" | "spicy" | "frozen";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-foreground/5 text-foreground/70",
  bio: "bg-green-50 text-green-700",
  spicy: "bg-red-50 text-red-700",
  frozen: "bg-blue-50 text-blue-700",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

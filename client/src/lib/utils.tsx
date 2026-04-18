import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate initials from name
 */
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Render avatar component - image or initials
 */
export const renderAvatar = (avatar: string, name: string, className?: string) => {
  if (avatar && avatar.startsWith("http")) {
    return (
      <img
        src={avatar}
        alt={`${name}'s avatar`}
        className={cn("h-16 w-16 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold", className)}>
      {getInitials(name)}
    </div>
  );
};

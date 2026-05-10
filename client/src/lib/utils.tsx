import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a person name for display without mutating stored user data.
 */
export const formatName = (name?: string) => {
  return (name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Generate initials from formatted first and last name.
 */
export const getInitials = (name?: string) => {
  const parts = formatName(name).split(" ").filter(Boolean);
  const initialsSource = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;

  return initialsSource
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Render avatar component - image or initials
 */
export const renderAvatar = (avatar: string, name: string, className?: string) => {
  const displayName = formatName(name);
  const avatarValue = avatar?.trim();
  const isImageAvatar =
    avatarValue &&
    (avatarValue.startsWith("http") ||
      avatarValue.startsWith("blob:") ||
      avatarValue.startsWith("data:") ||
      avatarValue.startsWith("/"));

  if (isImageAvatar) {
    return (
      <img
        src={avatarValue}
        alt={`${displayName || "User"}'s avatar`}
        className={cn("h-16 w-16 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold", className)}>
      {getInitials(displayName)}
    </div>
  );
};

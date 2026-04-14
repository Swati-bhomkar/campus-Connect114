import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/lib/mock-data";
import { BadgeCheck, Clock, ShieldAlert } from "lucide-react";

interface ReputationBadgeProps {
  score: number;
  className?: string;
}

export function ReputationBadge({ score, className }: ReputationBadgeProps) {
  const level = score >= 80 ? "high" : score >= 50 ? "mid" : "low";
  const colors = {
    high: "bg-emerald-50 text-emerald-700 border-emerald-200",
    mid: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-slate-50 text-slate-500 border-slate-200",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", colors[level], className)}>
      ★ {score}
    </span>
  );
}

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  if (status === "unverified") return null;

  const config = {
    verified: { icon: BadgeCheck, label: "Verified", cls: "text-emerald-600" },
    pending: { icon: Clock, label: "Pending", cls: "text-amber-500" },
  };

  const { icon: Icon, label, cls } = config[status];

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", cls, className)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

interface AvailabilityIndicatorProps {
  available: boolean;
  className?: string;
}

export function AvailabilityIndicator({ available, className }: AvailabilityIndicatorProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", className)}>
      <span className={cn("h-2 w-2 rounded-full", available ? "bg-emerald-500" : "bg-slate-300")} />
      {available ? "Accepting referrals" : "Not accepting"}
    </span>
  );
}

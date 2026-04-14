import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReferralRequest } from "@/lib/mock-data";
import { getUserById } from "@/lib/mock-data";
import { FileText, Check, X, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; cls: string; icon: typeof Check }> = {
  pending: { label: "Pending", cls: "text-amber-600 bg-amber-50", icon: Clock },
  accepted: { label: "Accepted", cls: "text-emerald-600 bg-emerald-50", icon: Check },
  rejected: { label: "Rejected", cls: "text-red-600 bg-red-50", icon: X },
  expired: { label: "Expired", cls: "text-slate-500 bg-slate-50", icon: AlertTriangle },
};

interface ReferralRequestCardProps {
  request: ReferralRequest;
  perspective: "sender" | "receiver";
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

export function ReferralRequestCard({ request, perspective, onAccept, onReject, className }: ReferralRequestCardProps) {
  const otherUser = getUserById(perspective === "sender" ? request.toUserId : request.fromUserId);
  const status = statusConfig[request.status];
  const StatusIcon = status.icon;

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {otherUser && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {otherUser.avatar}
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-foreground">{otherUser?.name}</span>
              <p className="text-xs text-muted-foreground">
                {otherUser?.company && `${otherUser.company} · `}{perspective === "sender" ? "Sent" : "Received"} {new Date(request.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
            </div>
          </div>
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", status.cls)}>
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </span>
        </div>

        <div className="mt-3 rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{request.jobRole}</p>
              <p className="text-xs text-muted-foreground">{request.company} · {request.jobId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Skills Match</p>
              <p className={cn("text-lg font-bold tabular-nums", request.skillsMatchScore >= 70 ? "text-emerald-600" : request.skillsMatchScore >= 50 ? "text-amber-600" : "text-red-500")}>
                {request.skillsMatchScore}%
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
            <FileText className="h-3.5 w-3.5" />
            View Resume
          </button>

          {perspective === "receiver" && request.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onReject?.(request.id)}>
                <X className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
              <Button size="sm" onClick={() => onAccept?.(request.id)}>
                <Check className="h-3.5 w-3.5 mr-1" /> Accept
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

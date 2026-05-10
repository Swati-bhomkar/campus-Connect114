import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReferralRequest as MockReferralRequest } from "@/lib/mock-data";
import { getUserById } from "@/lib/mock-data";
import { FileText, Check, X, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import { cn, formatName, renderAvatar } from "@/lib/utils";

const statusConfig: Record<string, { label: string; cls: string; icon: typeof Check }> = {
  pending: { label: "Pending", cls: "text-amber-600 bg-amber-50", icon: Clock },
  accepted: { label: "Accepted", cls: "text-emerald-600 bg-emerald-50", icon: Check },
  rejected: { label: "Rejected", cls: "text-red-600 bg-red-50", icon: X },
  expired: { label: "Expired", cls: "text-slate-500 bg-slate-50", icon: AlertTriangle },
};

type ReferralUser = {
  id?: string;
  _id?: string;
  name?: string;
  avatar?: string;
  role?: string;
  company?: string;
};

type ReferralRequest = Partial<MockReferralRequest> & {
  _id?: string;
  requester?: ReferralUser | null;
  alumni?: ReferralUser | null;
  referralPost?: {
    id?: string;
    _id?: string;
    title?: string;
    company?: string;
  } | null;
  company?: string;
  jobRole?: string;
  jobId?: string;
  skillsMatchScore?: number;
};

interface ReferralRequestCardProps {
  request: ReferralRequest;
  perspective: "sender" | "receiver";
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

export function ReferralRequestCard({ request, perspective, onAccept, onReject, className }: ReferralRequestCardProps) {
  const requestId = request.id || request._id || "";
  const otherUser =
    perspective === "sender"
      ? request.alumni || getUserById(String(request.alumniId || ""))
      : request.requester || getUserById(String(request.requesterId || ""));
  const status = statusConfig[request.status || "pending"] || statusConfig.pending;
  const StatusIcon = status.icon;
  const company = request.companySnapshot || request.company || request.referralPost?.company || "Company";
  const role = request.roleSnapshot || request.jobRole || request.referralPost?.title || "Referral role";
  const submittedAt = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : "";
  const motivation = request.motivation?.trim();
  const matchScore = typeof request.skillsMatchScore === "number" ? request.skillsMatchScore : null;
  const requesterRole = request.requester?.role || request.requesterRole;
  const otherUserName = formatName(otherUser?.name);

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {otherUser && (
              renderAvatar(otherUser.avatar || "", otherUserName, "h-9 w-9 text-xs")
            )}
            <div>
              <span className="text-sm font-medium text-foreground">{otherUserName}</span>
              <p className="text-xs text-muted-foreground">
                {otherUser?.company && `${otherUser.company} - `}
                {perspective === "receiver" && requesterRole ? `${requesterRole} - ` : ""}
                {perspective === "sender" ? "Sent" : "Received"} {submittedAt}
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
              <p className="text-sm font-medium text-foreground">{role}</p>
              <p className="text-xs text-muted-foreground">
                {company}
                {request.jobId ? ` - ${request.jobId}` : ""}
              </p>
            </div>
            {matchScore !== null && (
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Skills Match</p>
                <p className={cn("text-lg font-bold tabular-nums", matchScore >= 70 ? "text-emerald-600" : matchScore >= 50 ? "text-amber-600" : "text-red-500")}>
                  {matchScore}%
                </p>
              </div>
            )}
          </div>
          {motivation && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{motivation}</p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {request.resumeUrl && (
              <a href={request.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                <FileText className="h-3.5 w-3.5" />
                View Resume
              </a>
            )}
            {request.linkedinUrl && (
              <a href={request.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                <ExternalLink className="h-3.5 w-3.5" />
                LinkedIn
              </a>
            )}
          </div>

          {perspective === "receiver" && request.status === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => onReject?.(requestId)}>
                <X className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
              <Button size="sm" onClick={() => onAccept?.(requestId)}>
                <Check className="h-3.5 w-3.5 mr-1" /> Accept
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

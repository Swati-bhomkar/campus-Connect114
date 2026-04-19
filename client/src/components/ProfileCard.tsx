import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReputationBadge, VerificationBadge, AvailabilityIndicator } from "@/components/StatusBadges";
import type { User } from "@/lib/mock-data";
import { UserPlus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { renderAvatar } from "@/lib/utils";

interface ProfileCardProps {
  user: User;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export function ProfileCard({ user, showActions = true, compact = false, className }: ProfileCardProps) {
  const navigate = useNavigate();

  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardContent className={compact ? "p-4" : "p-5"}>
        <div className="flex items-start gap-4">
          {renderAvatar(user.avatar, user.name, "h-11 w-11")}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground truncate">{user.name}</span>
              {user.role === "alumni" && <VerificationBadge status={user.companyVerified} />}
              <ReputationBadge score={user.reputationScore} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {user.role === "alumni" ? `${user.company} · Class of ${user.passOutYear}` : `Student · Class of ${user.passOutYear}`}
            </p>
            <p className="text-sm text-muted-foreground">{user.domain}</p>
            {!compact && (
              <>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {user.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
                {user.role === "alumni" && (
                  <div className="mt-2">
                    <AvailabilityIndicator available={user.availableForReferrals} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2 mt-4 pt-3 border-t">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/profile/${user.id}`)}>
              <Eye className="h-3.5 w-3.5 mr-1.5" /> View
            </Button>
            <Button size="sm" className="flex-1">
              <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Connect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USERS } from "@/lib/mock-data";
import {
  LayoutDashboard, Users, BadgeCheck, BarChart3, ShieldAlert, Settings,
  FileText, Check, X, ShieldCheck, Shield, ShieldOff, Eye,
} from "lucide-react";

const ADMIN = USERS.find(u => u.id === "u15")!;
const NAV = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Verifications", url: "/admin/verifications", icon: BadgeCheck },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Spam & Abuse", url: "/admin/spam", icon: ShieldAlert },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const pendingVerifications = USERS.filter(u => u.companyVerified === "pending");

type BadgeType = "verified_professional" | "verified_higher_studies" | "self_declared" | "unverified";

const BADGE_OPTIONS: { value: BadgeType; label: string; icon: React.ReactNode }[] = [
  { value: "verified_professional", label: "Verified Professional", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  { value: "verified_higher_studies", label: "Verified Higher Studies", icon: <Shield className="h-3.5 w-3.5" /> },
  { value: "self_declared", label: "Self-declared", icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  { value: "unverified", label: "Unverified", icon: <ShieldOff className="h-3.5 w-3.5" /> },
];

export default function AdminVerifications() {
  const [assignedBadges, setAssignedBadges] = useState<Record<string, BadgeType>>({});
  const [actions, setActions] = useState<Record<string, "approved" | "rejected">>({});

  const handleApprove = (userId: string) => {
    setActions(prev => ({ ...prev, [userId]: "approved" }));
  };

  const handleReject = (userId: string) => {
    setActions(prev => ({ ...prev, [userId]: "rejected" }));
  };

  return (
    <DashboardLayout navItems={NAV} groupLabel="Admin" userName={ADMIN.name} userRole="Admin" userAvatar={ADMIN.avatar}>
      <h2 className="text-xl font-bold text-foreground mb-1">Company Verifications</h2>
      <p className="text-sm text-muted-foreground mb-6">{pendingVerifications.length} pending verification{pendingVerifications.length !== 1 ? "s" : ""}</p>

      <div className="space-y-4">
        {pendingVerifications.map(u => (
          <Card key={u.id} className={actions[u.id] ? "opacity-60" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">{u.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{u.name}</h3>
                    {actions[u.id] === "approved" && (
                      <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20 text-xs">Approved</Badge>
                    )}
                    {actions[u.id] === "rejected" && (
                      <Badge variant="destructive" className="text-xs">Rejected</Badge>
                    )}
                    {!actions[u.id] && (
                      <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200 text-xs">Pending</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Claims to work at <span className="font-medium text-foreground">{u.company}</span></p>
                  <p className="text-sm text-muted-foreground">{u.domain} · Class of {u.passOutYear}</p>

                  <div className="mt-3 rounded-lg bg-secondary/50 p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>offer_letter_blurred.pdf</span>
                      <button className="text-primary text-xs hover:underline ml-auto flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Preview
                      </button>
                    </div>
                  </div>

                  {/* Badge Assignment */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Assign Badge:</span>
                    <Select
                      value={assignedBadges[u.id] || ""}
                      onValueChange={(v) => setAssignedBadges(prev => ({ ...prev, [u.id]: v as BadgeType }))}
                    >
                      <SelectTrigger className="w-[200px] h-8 text-xs">
                        <SelectValue placeholder="Select badge" />
                      </SelectTrigger>
                      <SelectContent>
                        {BADGE_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <span className="flex items-center gap-1.5">{opt.icon} {opt.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {!actions[u.id] && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleReject(u.id)}>
                        <X className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(u.id)}>
                        <Check className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pendingVerifications.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <BadgeCheck className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">All verifications are up to date</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

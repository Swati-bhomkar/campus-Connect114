import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { USERS } from "@/lib/mock-data";
import { LayoutDashboard, Users, BadgeCheck, BarChart3, ShieldAlert, Settings, AlertTriangle, Clock } from "lucide-react";

const ADMIN = USERS.find(u => u.id === "u15")!;
const NAV = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Verifications", url: "/admin/verifications", icon: BadgeCheck },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Spam & Abuse", url: "/admin/spam", icon: ShieldAlert },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const auditLogs = [
  { id: 1, action: "User verified", detail: "Ananya Desai — company verification submitted", timestamp: "2025-03-19 14:30", severity: "info" as const },
  { id: 2, action: "Referral rejected", detail: "Arjun Mehta rejected referral from Aditya Joshi (low skills match)", timestamp: "2025-02-08 09:15", severity: "info" as const },
  { id: 3, action: "Rate limit hit", detail: "Karan Patel attempted to send 4th referral request today (limit: 3)", timestamp: "2025-03-10 16:22", severity: "warning" as const },
  { id: 4, action: "Account created", detail: "Vikram Singh registered via college email", timestamp: "2024-09-01 10:00", severity: "info" as const },
];

export default function AdminSpam() {
  return (
    <DashboardLayout navItems={NAV} groupLabel="Admin" userName={ADMIN.name} userRole="Admin" userAvatar={ADMIN.avatar}>
      <h2 className="text-xl font-bold text-foreground mb-1">Spam & Abuse Detection</h2>
      <p className="text-sm text-muted-foreground mb-6">Flagged users and system audit logs</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Flagged Users</CardTitle>
          <CardDescription>Users with 3+ community flags are auto-reviewed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-secondary/50 p-6 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No flagged users at this time</p>
            <p className="text-xs text-muted-foreground mt-1">The system auto-flags users with 3+ community reports</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Audit Log</CardTitle>
          <CardDescription>Recent system events and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map(log => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className="mt-0.5">
                  {log.severity === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{log.action}</p>
                    {log.severity === "warning" && <Badge variant="outline" className="text-xs text-amber-700 bg-amber-50 border-amber-200">Warning</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{log.detail}</p>
                  <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

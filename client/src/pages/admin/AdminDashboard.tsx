import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { USERS, ANALYTICS } from "@/lib/mock-data";
import { LayoutDashboard, Users, BadgeCheck, BarChart3, ShieldAlert, Settings, Newspaper } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

const ADMIN = USERS.find(u => u.id === "u15")!;
const NAV = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Verifications", url: "/admin/verifications", icon: BadgeCheck },
  { title: "Posts", url: "/admin/posts", icon: Newspaper },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Spam & Abuse", url: "/admin/spam", icon: ShieldAlert },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout navItems={NAV} groupLabel="Admin" userName={ADMIN.name} userRole="Admin" userAvatar={ADMIN.avatar}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">Platform overview and management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard title="Total Users" value={ANALYTICS.totalUsers} subtitle={`${ANALYTICS.totalStudents} students · ${ANALYTICS.totalAlumni} alumni`} />
        <StatsCard title="Total Referrals" value={ANALYTICS.totalReferrals} subtitle={`${ANALYTICS.acceptedReferrals} accepted`} trend={{ value: "+18% this month", positive: true }} />
        <StatsCard title="Pending Verifications" value={1} subtitle="Company verifications" />
        <StatsCard title="Flagged Users" value={0} subtitle="Requires review" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Referrals</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ANALYTICS.monthlyReferrals}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Bar dataKey="sent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="accepted" fill="hsl(152, 60%, 36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 justify-center mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Sent</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "hsl(152, 60%, 36%)" }} /> Accepted</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Alumni (by referrals)</h3>
          <div className="space-y-3">
            {ANALYTICS.topAlumni.map((a, i) => (
              <div key={a.userId} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                </div>
                <span className="text-sm font-bold tabular-nums text-foreground">{a.referrals}</span>
                <span className="text-xs text-muted-foreground">★ {a.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

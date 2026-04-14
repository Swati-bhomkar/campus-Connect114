import { DashboardLayout } from "@/components/DashboardLayout";
import { USERS, ANALYTICS } from "@/lib/mock-data";
import { LayoutDashboard, Users, BadgeCheck, BarChart3, ShieldAlert, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ADMIN = USERS.find(u => u.id === "u15")!;
const NAV = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Verifications", url: "/admin/verifications", icon: BadgeCheck },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Spam & Abuse", url: "/admin/spam", icon: ShieldAlert },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const PIE_COLORS = ["hsl(220, 60%, 20%)", "hsl(215, 40%, 40%)", "hsl(210, 30%, 55%)", "hsl(205, 25%, 65%)", "hsl(200, 20%, 75%)", "hsl(195, 15%, 80%)", "hsl(190, 10%, 85%)", "hsl(185, 10%, 90%)"];

export default function AdminAnalytics() {
  return (
    <DashboardLayout navItems={NAV} groupLabel="Admin" userName={ADMIN.name} userRole="Admin" userAvatar={ADMIN.avatar}>
      <h2 className="text-xl font-bold text-foreground mb-1">Analytics</h2>
      <p className="text-sm text-muted-foreground mb-6">Platform insights and trends</p>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Referral trends */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Referral Trends (6 months)</h3>
          <ResponsiveContainer width="100%" height={240}>
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

        {/* Company distribution */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Alumni by Company</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={ANALYTICS.companyDistribution} dataKey="count" nameKey="company" cx="50%" cy="50%" outerRadius={80} label={({ company }) => company}>
                {ANALYTICS.companyDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skill gaps */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Skill Gap Analysis</h3>
          <div className="space-y-4">
            {ANALYTICS.skillGaps.map(sg => (
              <div key={sg.skill}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{sg.skill}</span>
                  <span className="text-xs text-muted-foreground">Demand {sg.demand}% · Supply {sg.supply}%</span>
                </div>
                <div className="flex gap-1 h-2">
                  <div className="rounded-full bg-primary" style={{ width: `${sg.demand}%` }} />
                  <div className="rounded-full bg-border" style={{ width: `${100 - sg.demand}%` }} />
                </div>
                <div className="flex gap-1 h-2 mt-1">
                  <div className="rounded-full" style={{ width: `${sg.supply}%`, background: "hsl(152, 60%, 36%)" }} />
                  <div className="rounded-full bg-border" style={{ width: `${100 - sg.supply}%` }} />
                </div>
              </div>
            ))}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Industry Demand</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: "hsl(152, 60%, 36%)" }} /> Student Supply</span>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Most Helpful Alumni</h3>
          <div className="space-y-3">
            {ANALYTICS.topAlumni.map((a, i) => {
              const user = USERS.find(u => u.id === a.userId);
              return (
                <div key={a.userId} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.company} · {user?.domain}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums text-foreground">{a.referrals}</p>
                    <p className="text-xs text-muted-foreground">referrals</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

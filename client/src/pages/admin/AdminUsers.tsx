import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USERS } from "@/lib/mock-data";
import { LayoutDashboard, Users, BadgeCheck, BarChart3, ShieldAlert, Settings, Search, MoreHorizontal } from "lucide-react";
import { ReputationBadge, VerificationBadge } from "@/components/StatusBadges";
import { cn } from "@/lib/utils";

const ADMIN = USERS.find(u => u.id === "u15")!;
const NAV = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Verifications", url: "/admin/verifications", icon: BadgeCheck },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Spam & Abuse", url: "/admin/spam", icon: ShieldAlert },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = USERS.filter(u => {
    if (u.role === "admin") return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <DashboardLayout navItems={NAV} groupLabel="Admin" userName={ADMIN.name} userRole="Admin" userAvatar={ADMIN.avatar}>
      <h2 className="text-xl font-bold text-foreground mb-1">User Management</h2>
      <p className="text-sm text-muted-foreground mb-6">{filtered.length} users</p>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="student">Students</SelectItem>
            <SelectItem value="alumni">Alumni</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Reputation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(u => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">{u.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize text-xs">{u.role}</Badge>
                </TableCell>
                <TableCell className="text-sm">{u.passOutYear}</TableCell>
                <TableCell>
                  {u.company ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{u.company}</span>
                      <VerificationBadge status={u.companyVerified} />
                    </div>
                  ) : <span className="text-sm text-muted-foreground">—</span>}
                </TableCell>
                <TableCell><ReputationBadge score={u.reputationScore} /></TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}

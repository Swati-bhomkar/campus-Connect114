import { useState } from "react";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProfileCard } from "@/components/ProfileCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { USERS } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Settings } from "lucide-react";

const STUDENT_NAV = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Discovery", url: "/student/discovery", icon: Search },
  { title: "Connections", url: "/student/connections", icon: Users },
  { title: "My Referrals", url: "/student/referrals", icon: FileText },
  { title: "Posts", url: "/student/posts", icon: Newspaper },
  { title: "Create Post", url: "/student/create-post", icon: PlusCircle },
  { title: "My Profile", url: "/student/profile", icon: User },
];

const ALUMNI_NAV = [
  { title: "Overview", url: "/alumni", icon: LayoutDashboard },
  { title: "Discovery", url: "/alumni/discovery", icon: Search },
  { title: "Incoming Requests", url: "/alumni/requests", icon: FileText },
  { title: "Connections", url: "/alumni/connections", icon: Users },
  { title: "My Posts", url: "/alumni/posts", icon: Newspaper },
  { title: "Create Post", url: "/alumni/create-post", icon: PlusCircle },
  { title: "Referral Settings", url: "/alumni/settings", icon: Settings },
  { title: "My Profile", url: "/alumni/profile", icon: User },
];

const STUDENT = USERS.find(u => u.id === "u4")!;
const ALUMNI = USERS.find(u => u.id === "u1")!;
const DOMAINS = [...new Set(USERS.map(u => u.domain))];
const COMPANIES = [...new Set(USERS.filter(u => u.company).map(u => u.company!))];
const YEARS = [...new Set(USERS.map(u => u.passOutYear))].sort();

export default function StudentDiscovery() {
  const location = useLocation();
  const isAlumni = location.pathname.startsWith("/alumni");
  const currentUser = isAlumni ? ALUMNI : STUDENT;
  const NAV = isAlumni ? ALUMNI_NAV : STUDENT_NAV;
  const roleLabel = isAlumni ? "Alumni" : "Student";

  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("all");
  const [company, setCompany] = useState("all");
  const [year, setYear] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = USERS.filter(u => {
    if (u.id === currentUser.id || u.role === "admin") return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    if (domain !== "all" && u.domain !== domain) return false;
    if (company !== "all" && u.company !== company) return false;
    if (year !== "all" && u.passOutYear !== Number(year)) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (onlyAvailable && !u.availableForReferrals) return false;
    return true;
  }).sort((a, b) => b.reputationScore - a.reputationScore);

  return (
    <DashboardLayout navItems={NAV} groupLabel={roleLabel} userName={currentUser.name} userRole={roleLabel} userAvatar={currentUser.avatar} currentUser={currentUser}>
      <h2 className="text-xl font-bold text-foreground mb-1">Discover People</h2>
      <p className="text-sm text-muted-foreground mb-6">Find alumni and peers from your college</p>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <div className="space-y-5 rounded-lg border bg-card p-5">
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Search</Label>
            <Input placeholder="Name or skill..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Role</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Domain</Label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {DOMAINS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</Label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {COMPANIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pass-out Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {YEARS.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Available for referrals only</Label>
            <Switch checked={onlyAvailable} onCheckedChange={setOnlyAvailable} />
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} result{filtered.length !== 1 ? "s" : ""} — sorted by reputation</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map(u => (
              <ProfileCard key={u.id} user={u} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">No users match your filters. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

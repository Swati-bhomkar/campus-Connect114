import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProfileCard } from "@/components/ProfileCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { searchUsers } from "@/lib/api";
import { formatName } from "@/lib/utils";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User as UserIcon, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const STUDENT_NAV = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Discovery", url: "/student/discovery", icon: Search },
  { title: "Connections", url: "/student/connections", icon: Users },
  { title: "My Referrals", url: "/student/referrals", icon: FileText },
  { title: "Posts", url: "/student/posts", icon: Newspaper },
  { title: "Create Post", url: "/student/create-post", icon: PlusCircle },
  { title: "My Profile", url: "/student/profile", icon: UserIcon },
];

const ALUMNI_NAV = [
  { title: "Overview", url: "/alumni", icon: LayoutDashboard },
  { title: "Discovery", url: "/alumni/discovery", icon: Search },
  { title: "Incoming Requests", url: "/alumni/requests", icon: FileText },
  { title: "Connections", url: "/alumni/connections", icon: Users },
  { title: "My Posts", url: "/alumni/posts", icon: Newspaper },
  { title: "Create Post", url: "/alumni/create-post", icon: PlusCircle },
  { title: "Referral Settings", url: "/alumni/settings", icon: Settings },
  { title: "My Profile", url: "/alumni/profile", icon: UserIcon },
];

export default function StudentDiscovery() {
  const { currentUser, loading: authLoading } = useAuth();
  const isAlumni = currentUser?.role === "alumni";
  const NAV = isAlumni ? ALUMNI_NAV : STUDENT_NAV;
  const roleLabel = isAlumni ? "Alumni" : "Student";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [years, setYears] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [domain, setDomain] = useState("all");
  const [company, setCompany] = useState("all");
  const [year, setYear] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await searchUsers({
        search: debouncedSearch,
        role: roleFilter,
        domain,
        company,
        passOutYear: year,
        availableOnly: onlyAvailable,
      });
      setUsers(fetchedUsers);
      
      // Update filter options from fetched data
      setDomains([...new Set(fetchedUsers.map(u => u.domain))]);
      setCompanies([...new Set(fetchedUsers.filter(u => u.company).map(u => u.company))]);
      setYears([...new Set(fetchedUsers.map(u => u.passOutYear))].sort());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, domain, company, year, roleFilter, onlyAvailable]);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (authLoading || !currentUser) {
    return null;
  }

  const currentUserName = formatName(currentUser?.name || "User");
  const displayCurrentUser = currentUser ? { ...currentUser, name: currentUserName } : undefined;

  return (
    <DashboardLayout 
      navItems={NAV} 
      groupLabel={roleLabel} 
      userName={currentUserName} 
      userRole={roleLabel} 
      userAvatar={currentUser?.avatar || ""} 
      currentUser={displayCurrentUser}
    >
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
                {domains.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</Label>
            <Select value={company} onValueChange={setCompany}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Pass-out Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
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
          {loading ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">Loading users...</p>
            </div>
          ) : error ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-sm text-red-500">Error: {error}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">{users.length} result{users.length !== 1 ? "s" : ""} — sorted by reputation</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {users.map(u => (
                  <ProfileCard 
                    key={u.id} 
                    user={u} 
                  />
                ))}
              </div>
              {users.length === 0 && (
                <div className="rounded-lg border bg-card p-8 text-center">
                  <p className="text-sm text-muted-foreground">No users match your filters. Try adjusting your search.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

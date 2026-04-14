import { useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { USERS, CONNECTIONS, getUserById } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Check, X, Clock, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const statusBadge: Record<string, { cls: string; icon: typeof Check }> = {
  accepted: { cls: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: Check },
  pending: { cls: "text-amber-700 bg-amber-50 border-amber-200", icon: Clock },
  rejected: { cls: "text-red-700 bg-red-50 border-red-200", icon: X },
};

const purposeLabel: Record<string, string> = {
  resume_review: "Resume Review",
  career_guidance: "Career Guidance",
  referral: "Referral",
};

export default function StudentConnections() {
  const location = useLocation();
  const isAlumni = location.pathname.startsWith("/alumni");
  const currentUser = isAlumni ? ALUMNI : STUDENT;
  const NAV = isAlumni ? ALUMNI_NAV : STUDENT_NAV;
  const roleLabel = isAlumni ? "Alumni" : "Student";

  const myConnections = CONNECTIONS.filter(c => c.fromUserId === currentUser.id || c.toUserId === currentUser.id);

  return (
    <DashboardLayout navItems={NAV} groupLabel={roleLabel} userName={currentUser.name} userRole={roleLabel} userAvatar={currentUser.avatar} currentUser={currentUser}>
      <h2 className="text-xl font-bold text-foreground mb-1">My Connections</h2>
      <p className="text-sm text-muted-foreground mb-6">{myConnections.length} professional connections</p>

      <div className="space-y-3">
        {myConnections.map(conn => {
          const otherId = conn.fromUserId === STUDENT.id ? conn.toUserId : conn.fromUserId;
          const other = getUserById(otherId);
          if (!other) return null;
          const st = statusBadge[conn.status];
          const StIcon = st.icon;

          return (
            <div key={conn.id} className="flex items-center gap-4 rounded-lg border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {other.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{other.name}</p>
                <p className="text-sm text-muted-foreground">{other.company ? `${other.company} · ` : ""}{other.domain}</p>
              </div>
              <Badge variant="outline" className={cn("shrink-0 gap-1 text-xs", purposeLabel[conn.purpose] && "")}>
                {purposeLabel[conn.purpose]}
              </Badge>
              <Badge variant="outline" className={cn("shrink-0 gap-1 text-xs", st.cls)}>
                <StIcon className="h-3 w-3" />
                {conn.status.charAt(0).toUpperCase() + conn.status.slice(1)}
              </Badge>
            </div>
          );
        })}

        {myConnections.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No connections yet. Discover and connect with alumni!</p>
            <Button className="mt-3" variant="outline" size="sm">Discover People</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

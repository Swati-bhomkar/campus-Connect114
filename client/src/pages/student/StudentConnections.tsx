import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getConnections, getCurrentUser } from "@/lib/api";
import { renderAvatar } from "@/lib/utils";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User as UserIcon, Check, X, Clock, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type User } from "@/lib/mock-data";

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
  { title: "My Profile", url: "/alumni/profile", icon:UserIcon },
];

interface ConnectedUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  company?: string;
  domain?: string;
  passOutYear?: number;
  reputationScore?: number;
}

interface ConnectionItem {
  connectionId: string;
  connectedUser: ConnectedUser;
  status: "pending" | "accepted" | "rejected";
  purpose: "resume_review" | "career_guidance" | "referral";
  connectedAt: string;
}

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<ConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, connectionData] = await Promise.all([getCurrentUser(), getConnections()]);
        setCurrentUser(user);
        setConnections(connectionData);
      } catch (error) {
        console.error("Failed to load connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isAlumni = currentUser?.role === "alumni";
  const NAV = isAlumni ? ALUMNI_NAV : STUDENT_NAV;
  const roleLabel = isAlumni ? "Alumni" : "Student";

  if (loading || !currentUser) {
    return (
      <DashboardLayout navItems={NAV} groupLabel={roleLabel} userName={currentUser?.name || "Loading"} userRole={roleLabel} userAvatar={currentUser?.avatar || ""} currentUser={currentUser || undefined}>
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading connections...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={NAV} groupLabel={roleLabel} userName={currentUser.name} userRole={roleLabel} userAvatar={currentUser.avatar} currentUser={currentUser}>
      <h2 className="text-xl font-bold text-foreground mb-1">My Connections</h2>
      <p className="text-sm text-muted-foreground mb-6">{connections.length} professional connections</p>

      <div className="space-y-3">
        {connections.map(conn => {
          const other = conn.connectedUser;
          const st = statusBadge[conn.status];
          const StIcon = st.icon;

          return (
            <div key={conn.connectionId} className="flex items-center gap-4 rounded-lg border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {renderAvatar(other.avatar, other.name, "h-10 w-10 text-sm")}
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

        {connections.length === 0 && (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No connections yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

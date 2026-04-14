import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/PostCard";
import { ReputationBadge, VerificationBadge, AvailabilityIndicator } from "@/components/StatusBadges";
import { getUserById, getPostsByAuthor, USERS } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, UserPlus, Eye } from "lucide-react";

const NAV = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Discovery", url: "/student/discovery", icon: Search },
  { title: "Connections", url: "/student/connections", icon: Users },
  { title: "My Referrals", url: "/student/referrals", icon: FileText },
  { title: "Posts", url: "/student/posts", icon: Newspaper },
  { title: "Create Post", url: "/student/create-post", icon: PlusCircle },
  { title: "My Profile", url: "/student/profile", icon: User },
];

const CURRENT = USERS.find(u => u.id === "u4")!;

export default function ProfileView() {
  const { id } = useParams();
  const user = getUserById(id || "");

  if (!user) {
    return (
      <DashboardLayout navItems={NAV} groupLabel="Student" userName={CURRENT.name} userRole="Student" userAvatar={CURRENT.avatar} currentUser={CURRENT}>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const userPosts = getPostsByAuthor(user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={CURRENT.name} userRole="Student" userAvatar={CURRENT.avatar} currentUser={CURRENT}>
      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">{user.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                  {user.role === "alumni" && <VerificationBadge status={user.companyVerified} />}
                  <ReputationBadge score={user.reputationScore} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {user.role === "alumni" ? `${user.company} · ` : "Student · "}Class of {user.passOutYear}
                </p>
                <p className="text-sm text-muted-foreground">{user.domain}</p>
                {user.bio && <p className="text-sm text-foreground mt-2">{user.bio}</p>}
                {user.role === "alumni" && <div className="mt-2"><AvailabilityIndicator available={user.availableForReferrals} /></div>}
              </div>
            </div>

            <div className="flex gap-2 mt-5 pt-4 border-t">
              <Button className="flex-1"><UserPlus className="h-4 w-4 mr-1.5" /> Connect</Button>
              <Button variant="outline" className="flex-1"><Eye className="h-4 w-4 mr-1.5" /> Follow</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Skills</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {user.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Stats</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{user.reputationScore}</p>
                <p className="text-xs text-muted-foreground">Reputation</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{user.referralCount}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground capitalize">{user.currentStatus}</p>
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Posts */}
        {userPosts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Posts by {user.name}</h3>
            <div className="space-y-4">
              {userPosts.map(p => <PostCard key={p.id} post={p} />)}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

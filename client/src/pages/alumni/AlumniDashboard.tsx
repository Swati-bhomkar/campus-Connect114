import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { ReferralRequestCard } from "@/components/ReferralRequestCard";
import { PostCard } from "@/components/PostCard";
import { USERS, POSTS, getReferralRequestsForUser, getConnectionsForUser } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Settings } from "lucide-react";

const ALUMNI = USERS.find(u => u.id === "u1")!;

const NAV = [
  { title: "Overview", url: "/alumni", icon: LayoutDashboard },
  { title: "Discovery", url: "/alumni/discovery", icon: Search },
  { title: "Incoming Requests", url: "/alumni/requests", icon: FileText },
  { title: "Connections", url: "/alumni/connections", icon: Users },
  { title: "My Posts", url: "/alumni/posts", icon: Newspaper },
  { title: "Create Post", url: "/alumni/create-post", icon: PlusCircle },
  { title: "Referral Settings", url: "/alumni/settings", icon: Settings },
  { title: "My Profile", url: "/alumni/profile", icon: User },
];

export default function AlumniDashboard() {
  const incoming = getReferralRequestsForUser(ALUMNI.id, "received");
  const connections = getConnectionsForUser(ALUMNI.id);
  const myPosts = POSTS.filter(p => p.authorId === ALUMNI.id);

  return (
    <DashboardLayout navItems={NAV} groupLabel="Alumni" userName={ALUMNI.name} userRole="Alumni" userAvatar={ALUMNI.avatar} currentUser={ALUMNI}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Welcome back, {ALUMNI.name.split(" ")[0]}</h2>
        <p className="text-sm text-muted-foreground">Your alumni activity overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard title="Referrals Given" value={ALUMNI.referralCount} subtitle="Total accepted" icon={<FileText className="h-5 w-5" />} />
        <StatsCard title="Pending Requests" value={incoming.filter(r => r.status === "pending").length} subtitle="Awaiting your response" icon={<Users className="h-5 w-5" />} />
        <StatsCard title="Reputation" value={ALUMNI.reputationScore} subtitle="Top 10%" icon={<span className="text-lg">★</span>} />
        <StatsCard title="Monthly Cap" value={`${incoming.filter(r => r.status === "accepted").length}/${ALUMNI.maxReferralsPerMonth}`} subtitle="Referrals this month" icon={<Settings className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Pending Referral Requests</h3>
          <div className="space-y-3">
            {incoming.filter(r => r.status === "pending").map(r => (
              <ReferralRequestCard key={r.id} request={r} perspective="receiver" />
            ))}
            {incoming.filter(r => r.status === "pending").length === 0 && (
              <p className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary/50">No pending requests</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Your Recent Posts</h3>
          <div className="space-y-3">
            {myPosts.map(p => <PostCard key={p.id} post={p} />)}
            {myPosts.length === 0 && (
              <p className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary/50">No posts yet</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

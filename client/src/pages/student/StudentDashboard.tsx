import { DashboardLayout } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { PostCard } from "@/components/PostCard";
import { ReferralRequestCard } from "@/components/ReferralRequestCard";
import { USERS, POSTS, REFERRAL_REQUESTS, CONNECTIONS, getConnectionsForUser, getReferralRequestsForUser } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User } from "lucide-react";

const STUDENT = USERS.find(u => u.id === "u4")!;

const NAV = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Discovery", url: "/student/discovery", icon: Search },
  { title: "Connections", url: "/student/connections", icon: Users },
  { title: "My Referrals", url: "/student/referrals", icon: FileText },
  { title: "Posts", url: "/student/posts", icon: Newspaper },
  { title: "Create Post", url: "/student/create-post", icon: PlusCircle },
  { title: "My Profile", url: "/student/profile", icon: User },
];

export default function StudentDashboard() {
  const connections = getConnectionsForUser(STUDENT.id);
  const sentReferrals = getReferralRequestsForUser(STUDENT.id, "sent");
  const recentPosts = POSTS.slice(0, 3);

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={STUDENT.name} userRole="Student" userAvatar={STUDENT.avatar} currentUser={STUDENT}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Welcome back, {STUDENT.name.split(" ")[0]}</h2>
        <p className="text-sm text-muted-foreground">Here's your activity overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard title="Connections" value={connections.filter(c => c.status === "accepted").length} subtitle="Professional connections" icon={<Users className="h-5 w-5" />} />
        <StatsCard title="Pending Referrals" value={sentReferrals.filter(r => r.status === "pending").length} subtitle="Awaiting response" icon={<FileText className="h-5 w-5" />} />
        <StatsCard title="Reputation" value={STUDENT.reputationScore} subtitle="Keep contributing!" icon={<span className="text-lg">★</span>} />
        <StatsCard title="Posts" value={POSTS.filter(p => p.authorId === STUDENT.id).length} subtitle="Published posts" icon={<Newspaper className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Referral Requests</h3>
          <div className="space-y-3">
            {sentReferrals.slice(0, 3).map(r => (
              <ReferralRequestCard key={r.id} request={r} perspective="sender" />
            ))}
            {sentReferrals.length === 0 && <p className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary/50">No referral requests yet. Find alumni to connect with!</p>}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Latest Posts</h3>
          <div className="space-y-3">
            {recentPosts.map(p => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

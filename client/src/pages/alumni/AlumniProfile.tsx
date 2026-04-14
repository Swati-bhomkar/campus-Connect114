import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { ReputationBadge, VerificationBadge, AvailabilityIndicator } from "@/components/StatusBadges";
import { USERS, POSTS, type Post } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Settings, Pencil } from "lucide-react";
import { toast } from "sonner";

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

export default function AlumniProfile() {
  const [posts, setPosts] = useState<Post[]>(() =>
    POSTS.filter(p => p.authorId === ALUMNI.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  const handleDelete = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    toast.success("Post deleted successfully");
  };

  return (
    <DashboardLayout navItems={NAV} groupLabel="Alumni" userName={ALUMNI.name} userRole="Alumni" userAvatar={ALUMNI.avatar} currentUser={ALUMNI}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">My Profile</h2>
          <Button variant="outline" size="sm"><Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">{ALUMNI.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">{ALUMNI.name}</h3>
                  <VerificationBadge status={ALUMNI.companyVerified} />
                  <ReputationBadge score={ALUMNI.reputationScore} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{ALUMNI.company} · Class of {ALUMNI.passOutYear}</p>
                <p className="text-sm text-muted-foreground">{ALUMNI.domain}</p>
                <p className="text-sm text-foreground mt-2">{ALUMNI.bio}</p>
                <div className="mt-2"><AvailabilityIndicator available={ALUMNI.availableForReferrals} /></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Skills</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {ALUMNI.skills.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Stats</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{ALUMNI.reputationScore}</p>
                <p className="text-xs text-muted-foreground">Reputation</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{ALUMNI.referralCount}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{ALUMNI.maxReferralsPerMonth}</p>
                <p className="text-xs text-muted-foreground">Monthly Cap</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{ALUMNI.maxResumesPerDay}</p>
                <p className="text-xs text-muted-foreground">Daily Cap</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Posts */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">My Posts</h3>
          {posts.length === 0 ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">You haven't created any posts yet.</CardContent></Card>
          ) : (
            <div className="space-y-4">
              {posts.map(p => (
                <PostCard key={p.id} post={p} currentUserId={ALUMNI.id} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

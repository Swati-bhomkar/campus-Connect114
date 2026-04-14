import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/PostCard";
import { ReputationBadge } from "@/components/StatusBadges";
import { USERS, POSTS, type Post } from "@/lib/mock-data";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Pencil } from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Discovery", url: "/student/discovery", icon: Search },
  { title: "Connections", url: "/student/connections", icon: Users },
  { title: "My Referrals", url: "/student/referrals", icon: FileText },
  { title: "Posts", url: "/student/posts", icon: Newspaper },
  { title: "Create Post", url: "/student/create-post", icon: PlusCircle },
  { title: "My Profile", url: "/student/profile", icon: User },
];

const STUDENT = USERS.find(u => u.id === "u4")!;

export default function StudentProfile() {
  const [editing, setEditing] = useState(false);
  const [posts, setPosts] = useState<Post[]>(() =>
    POSTS.filter(p => p.authorId === STUDENT.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  const handleDelete = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    toast.success("Post deleted successfully");
  };

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={STUDENT.name} userRole="Student" userAvatar={STUDENT.avatar} currentUser={STUDENT}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">My Profile</h2>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> {editing ? "Cancel" : "Edit"}
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                {STUDENT.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">{STUDENT.name}</h3>
                  <ReputationBadge score={STUDENT.reputationScore} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">Student · Class of {STUDENT.passOutYear}</p>
                <p className="text-sm text-muted-foreground">{STUDENT.domain}</p>
                <p className="text-sm text-foreground mt-2">{STUDENT.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Email</CardTitle></CardHeader>
            <CardContent className="pt-0"><p className="text-sm font-medium">{STUDENT.email}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Registration Number</CardTitle></CardHeader>
            <CardContent className="pt-0"><p className="text-sm font-medium">{STUDENT.registrationNumber}</p></CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Skills</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {STUDENT.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Stats</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{STUDENT.reputationScore}</p>
                <p className="text-xs text-muted-foreground">Reputation</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{STUDENT.referralCount}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Connections</p>
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
                <PostCard key={p.id} post={p} currentUserId={STUDENT.id} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

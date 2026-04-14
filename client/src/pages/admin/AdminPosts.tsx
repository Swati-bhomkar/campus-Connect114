import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PostCard } from "@/components/PostCard";
import { USERS, POSTS, type Post } from "@/lib/mock-data";
import { LayoutDashboard, Users, BadgeCheck, BarChart3, ShieldAlert, Settings, Newspaper } from "lucide-react";
import { toast } from "sonner";

const ADMIN = USERS.find(u => u.id === "u15")!;
const NAV = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Verifications", url: "/admin/verifications", icon: BadgeCheck },
  { title: "Posts", url: "/admin/posts", icon: Newspaper },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Spam & Abuse", url: "/admin/spam", icon: ShieldAlert },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([...POSTS]);

  const handleDelete = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    toast.success("Post deleted.");
  };

  const handleFlag = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, flagged: !p.flagged } : p));
    toast.info("Post flag toggled.");
  };

  const flaggedCount = posts.filter(p => p.flagged).length;
  const withImages = posts.filter(p => p.imageUrl).length;

  return (
    <DashboardLayout navItems={NAV} groupLabel="Admin" userName={ADMIN.name} userRole="Admin" userAvatar={ADMIN.avatar}>
      <h2 className="text-xl font-bold text-foreground mb-1">Post Management</h2>
      <p className="text-sm text-muted-foreground mb-6">Monitor and moderate all professional posts</p>

      <div className="flex gap-4 mb-6 text-sm">
        <div className="rounded-lg border bg-card px-4 py-2">
          <span className="text-muted-foreground">Total: </span>
          <span className="font-semibold text-foreground">{posts.length}</span>
        </div>
        <div className="rounded-lg border bg-card px-4 py-2">
          <span className="text-muted-foreground">With images: </span>
          <span className="font-semibold text-foreground">{withImages}</span>
        </div>
        <div className="rounded-lg border border-destructive/30 bg-card px-4 py-2">
          <span className="text-muted-foreground">Flagged: </span>
          <span className="font-semibold text-destructive">{flaggedCount}</span>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        {posts.map(p => (
          <PostCard key={p.id} post={p} showAdminActions onDelete={handleDelete} onFlag={handleFlag} />
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary/50">No posts to display.</p>
        )}
      </div>
    </DashboardLayout>
  );
}

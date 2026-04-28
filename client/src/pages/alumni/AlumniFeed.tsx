import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PostCard } from "@/components/PostCard";
import { USERS, POSTS, type Post } from "@/lib/mock-data";
import { getFeedPosts } from "@/lib/api";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Settings } from "lucide-react";
import { toast } from "sonner";

const ALUMNI = USERS.find(u => u.id === "u1")!;
const NAV = [
  { title: "Overview", url: "/alumni", icon: LayoutDashboard },
  { title: "Discovery", url: "/alumni/discovery", icon: Search },
  { title: "Incoming Requests", url: "/alumni/requests", icon: FileText },
  { title: "Connections", url: "/alumni/connections", icon: Users },
  { title: "My Posts", url: "/alumni/posts", icon: Newspaper },
  { title: "Feed", url: "/alumni/feed", icon: Newspaper },
  { title: "Create Post", url: "/alumni/create-post", icon: PlusCircle },
  { title: "Referral Settings", url: "/alumni/settings", icon: Settings },
  { title: "My Profile", url: "/alumni/profile", icon: User },
];

export default function AlumniFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getFeedPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        toast.error("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    toast.success("Post deleted successfully");
  };

  return (
    <DashboardLayout navItems={NAV} groupLabel="Alumni" userName={ALUMNI.name} userRole="Alumni" userAvatar={ALUMNI.avatar} currentUser={ALUMNI}>
      <h2 className="text-xl font-bold text-foreground mb-1">Network Feed</h2>
      <p className="text-sm text-muted-foreground mb-6">Posts from you and your connected alumni</p>

      {loading ? (
        <div className="max-w-2xl space-y-4">
          <div className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="max-w-2xl text-center py-12">
          <p className="text-muted-foreground">No posts in your network yet. Create your first post!</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-4">
          {posts.map(p => <PostCard key={p.id} post={p} currentUserId={ALUMNI.id} onDelete={handleDelete} />)}
        </div>
      )}
    </DashboardLayout>
  );
}
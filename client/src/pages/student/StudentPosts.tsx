import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PostCard } from "@/components/PostCard";
import { USERS, POSTS, type Post } from "@/lib/mock-data";
import { getMyPosts } from "@/lib/api";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User } from "lucide-react";
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

export default function StudentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getMyPosts();
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
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={STUDENT.name} userRole="Student" userAvatar={STUDENT.avatar} currentUser={STUDENT}>
      <h2 className="text-xl font-bold text-foreground mb-1">Professional Posts</h2>
      <p className="text-sm text-muted-foreground mb-6">Structured updates from your college network</p>

      {loading ? (
        <div className="max-w-2xl space-y-4">
          <div className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="max-w-2xl text-center py-12">
          <p className="text-muted-foreground">No posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="max-w-2xl space-y-4">
          {posts.map(p => (
            <PostCard key={p.id} post={p} currentUserId={STUDENT.id} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

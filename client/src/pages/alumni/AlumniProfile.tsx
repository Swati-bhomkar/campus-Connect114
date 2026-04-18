import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostCard } from "@/components/PostCard";
import { ReputationBadge, VerificationBadge, AvailabilityIndicator } from "@/components/StatusBadges";
import { renderAvatar } from "@/lib/utils";
import { User, POSTS } from "@/lib/mock-data";
import { getCurrentUser ,updateCurrentUser } from "@/lib/api";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User as UserIcon, Settings, Pencil, Save, X } from "lucide-react";
import { toast } from "sonner";

const NAV = [
  { title: "Overview", url: "/alumni", icon: LayoutDashboard },
  { title: "Discovery", url: "/alumni/discovery", icon: Search },
  { title: "Incoming Requests", url: "/alumni/requests", icon: FileText },
  { title: "Connections", url: "/alumni/connections", icon: Users },
  { title: "My Posts", url: "/alumni/posts", icon: Newspaper },
  { title: "Create Post", url: "/alumni/create-post", icon: PlusCircle },
  { title: "Referral Settings", url: "/alumni/settings", icon: Settings },
  { title: "My Profile", url: "/alumni/profile", icon: Users },
];

export default function AlumniProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    skills: [] as string[],
    avatar: "",
  });
  const [saving, setSaving] = useState(false);

  const posts = user
  ? POSTS.filter(p => p.authorId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  : [];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setEditData({
          name: userData.name,
          bio: userData.bio || "",
          skills: userData.skills || [],
          avatar: userData.avatar || "",
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedUser = await updateCurrentUser(editData);
      setUser(updatedUser);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditData({
        name: user.name,
        bio: user.bio || "",
        skills: user.skills || [],
        avatar: user.avatar || "",
      });
    }
    setEditing(false);
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...editData.skills];
    newSkills[index] = value;
    setEditData({ ...editData, skills: newSkills });
  };

  const addSkill = () => {
    setEditData({ ...editData, skills: [...editData.skills, ""] });
  };

  const removeSkill = (index: number) => {
    const newSkills = editData.skills.filter((_, i) => i !== index);
    setEditData({ ...editData, skills: newSkills });
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <DashboardLayout navItems={NAV} groupLabel="Alumni" userName={user.name} userRole="Alumni" userAvatar={user.avatar} currentUser={user}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">My Profile</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => editing ? handleCancel() : setEditing(true)}
            disabled={saving}
          >
            {editing ? (
              <>
                <X className="h-3.5 w-3.5 mr-1.5" /> Cancel
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
              </>
            )}
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              {editing ? (
                <div className="flex flex-col gap-2">
                  {renderAvatar(editData.avatar, editData.name)}
                  <Input
                    placeholder="Avatar URL"
                    value={editData.avatar}
                    onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                    className="w-32 text-xs"
                  />
                </div>
              ) : (
                renderAvatar(user.avatar, user.name)
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {editing ? (
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="text-lg font-bold"
                    />
                  ) : (
                    <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                  )}
                  <VerificationBadge status={user.companyVerified} />
                  <ReputationBadge score={user.reputationScore} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{user.company} · Class of {user.passOutYear}</p>
                <p className="text-sm text-muted-foreground">{user.domain}</p>
                {editing ? (
                  <Textarea
                    placeholder="Bio"
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="mt-2"
                    rows={2}
                  />
                ) : (
                  user.bio && <p className="text-sm text-foreground mt-2">{user.bio}</p>
                )}
                <div className="mt-2"><AvailabilityIndicator available={user.availableForReferrals} /></div>
              </div>
            </div>

            {editing && (
              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Email</CardTitle></CardHeader>
            <CardContent className="pt-0"><p className="text-sm font-medium">{user.email}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Registration Number</CardTitle></CardHeader>
            <CardContent className="pt-0"><p className="text-sm font-medium">{user.registrationNumber}</p></CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Skills</CardTitle></CardHeader>
          <CardContent className="pt-0">
            {editing ? (
              <div className="space-y-2">
                {editData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      placeholder="Skill"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addSkill}>
                  Add Skill
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Stats</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{user.reputationScore}</p>
                <p className="text-xs text-muted-foreground">Reputation</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{user.referralCount}</p>
                <p className="text-xs text-muted-foreground">Referrals</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{user.maxReferralsPerMonth || "N/A"}</p>
                <p className="text-xs text-muted-foreground">Monthly Cap</p>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-foreground">{user.maxResumesPerDay || "N/A"}</p>
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
                <PostCard key={p.id} post={p} currentUserId={user.id} onDelete={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

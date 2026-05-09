import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LayoutDashboard, Search, Users, FileText, Newspaper, PlusCircle, User, Upload, Calendar, Clock, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getPostById, createReferralRequest } from "@/lib/api";

const NAV = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Discovery", url: "/student/discovery", icon: Search },
  { title: "Connections", url: "/student/connections", icon: Users },
  { title: "My Referrals", url: "/student/referrals", icon: FileText },
  { title: "Posts", url: "/student/posts", icon: Newspaper },
  { title: "Create Post", url: "/student/create-post", icon: PlusCircle },
  { title: "My Profile", url: "/student/profile", icon: User },
];

export default function CreateReferralRequest() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [motivation, setMotivation] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, loading: authLoading } = useAuth();

  // Post fetching state
  const [post, setPost] = useState<any>(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState<string | null>(null);

  // Fetch post data
  useEffect(() => {
    if (!postId) {
      setPostError("Invalid post ID");
      setPostLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setPostLoading(true);
        setPostError(null);
        const fetchedPost = await getPostById(postId);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setPostError("Failed to load referral post");
      } finally {
        setPostLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Validate post after loading
  useEffect(() => {
    if (!postLoading && post) {
      if (post.type !== "referral_opportunity") {
        setPostError("Invalid referral request");
        return;
      }
    }
  }, [postLoading, post]);

  // Redirect if auth not ready
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/login");
    }
  }, [authLoading, currentUser, navigate]);

  // Redirect on error after loading is complete
  useEffect(() => {
    if (!postLoading && postError) {
      toast.error(postError);
      navigate("/student/discovery");
    }
  }, [postLoading, postError, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) { // 5MB
      toast.error("Resume file size must be less than 5MB");
      return;
    }

    if (!resumeFile.name.endsWith('.pdf')) {
      toast.error("Resume must be a PDF file");
      return;
    }

    if (!currentUser) {
      toast.error("Please sign in to submit referral requests");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - in real implementation, this would upload file and create request
      const resumeUrl = `/resumes/${currentUser.id}_${Date.now()}.pdf`; // Mock URL

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Referral request submitted successfully!");
      navigate("/student/referrals");
    } catch (error) {
      toast.error("Failed to submit referral request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  // Show loading while auth or post is loading
  if (authLoading || postLoading) {
    return (
      <DashboardLayout navItems={NAV} groupLabel="Student" userName="" userRole="Student" userAvatar="" currentUser={null}>
        <div className="max-w-2xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-muted-foreground">Loading referral post...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Don't render anything if there's an error (will redirect)
  if (postError || !post || !currentUser) {
    return null;
  }

  // Get deadline from post metadata if available
  const deadline = post?.metadata?.deadline ? new Date(post.metadata.deadline) : null;

  return (
    <DashboardLayout navItems={NAV} groupLabel="Student" userName={currentUser.name} userRole="Student" userAvatar={currentUser.avatar} currentUser={currentUser}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-foreground mb-1">New Referral Request</h2>
        <p className="text-sm text-muted-foreground mb-6">Submit a structured referral request to an alumni</p>

        <div className="space-y-6">
          {/* Alumni Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Alumni Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                  {post.authorAvatar || post.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{post.authorName}</h3>
                  <p className="text-sm text-muted-foreground">{post.company} · {post.domain}</p>
                  {deadline && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Deadline: {deadline.toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Details</CardTitle>
              <CardDescription>All fields are required except motivation and LinkedIn URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Auto-filled Company */}
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={post.company} readOnly className="bg-secondary/50" />
                </div>

                {/* Auto-filled Role */}
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={post.title} readOnly className="bg-secondary/50" />
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label>Upload Resume (PDF only, max 5MB)</Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {resumeFile ? resumeFile.name : "Click to upload PDF resume"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF only, max 5MB</p>
                    </div>
                  </div>
                </div>

                {/* Motivation Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="motivation">
                    Why are you interested in this role? (Optional)
                  </Label>
                  <Textarea
                    id="motivation"
                    placeholder="Tell the alumni why you're interested in this role and what makes you a good fit..."
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    maxLength={250}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {motivation.length}/250 characters
                  </p>
                </div>

                {/* LinkedIn URL */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile URL (Optional)</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => navigate("/student/referrals")} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

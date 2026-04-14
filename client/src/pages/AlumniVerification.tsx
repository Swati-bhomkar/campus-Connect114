import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Upload, BadgeCheck } from "lucide-react";

export default function AlumniVerification() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<"email" | "document">("email");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">CC</div>
          <h1 className="text-2xl font-bold text-foreground">Verify Your Company</h1>
          <p className="mt-1 text-sm text-muted-foreground">Earn a verified badge on your profile</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-emerald-600" /> Company Verification
            </CardTitle>
            <CardDescription>Choose your verification method</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-5">
              <Button variant={method === "email" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setMethod("email")}>
                Work Email
              </Button>
              <Button variant={method === "document" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setMethod("document")}>
                Document Upload
              </Button>
            </div>

            {method === "email" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Work Email</Label>
                  <Input type="email" placeholder="name@company.com" />
                  <p className="text-xs text-muted-foreground">We'll verify the email domain matches your company</p>
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Google" />
                </div>
                <Button className="w-full">Send Verification Email</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Google" />
                </div>
                <div className="space-y-2">
                  <Label>Upload Verification Document</Label>
                  <div className="rounded-lg border-2 border-dashed border-border p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Offer letter or employee ID</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG (max 5MB)</p>
                    <p className="text-xs text-muted-foreground mt-1">Sensitive info will be blurred by admin</p>
                  </div>
                </div>
                <Button className="w-full">Submit for Review</Button>
              </div>
            )}

            <div className="mt-4 text-center">
              <button className="text-sm text-muted-foreground hover:text-foreground" onClick={() => navigate("/alumni")}>
                Skip for now
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

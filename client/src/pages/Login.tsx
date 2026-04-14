import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state as any)?.role || "student";
  const [loginType, setLoginType] = useState<"email" | "regnum">("email");
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleLogin = () => {
    if (showAdminLogin) {
      navigate("/admin");
    } else if (role === "alumni") {
      navigate("/alumni");
    } else {
      navigate("/student");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            CC
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {showAdminLogin ? "Admin Sign In" : role === "alumni" ? "Alumni Sign In" : "Student Sign In"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Access your professional network</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>Use your college credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-5">
              <Button
                variant={loginType === "email" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setLoginType("email")}
              >
                College Email
              </Button>
              <Button
                variant={loginType === "regnum" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setLoginType("regnum")}
              >
                Reg. Number
              </Button>
            </div>

            <div className="space-y-4">
              {loginType === "email" ? (
                <div className="space-y-2">
                  <Label htmlFor="email">College Email</Label>
                  <Input id="email" type="email" placeholder="name@klebcahubli.in" />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="regnum">Registration Number</Label>
                  <Input id="regnum" placeholder="CSE2023011" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full" onClick={handleLogin}>
                Sign In
              </Button>
            </div>

            {!showAdminLogin && (
              <div className="mt-4 text-center">
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() =>
                    navigate(role === "alumni" ? "/register/alumni" : "/register/student", {
                      state: { role },
                    })
                  }
                >
                  Don't have an account? Register
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-3 w-3" /> Back to role selection
          </button>
          {!showAdminLogin && (
            <button
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => setShowAdminLogin(true)}
            >
              Admin Login →
            </button>
          )}
          {showAdminLogin && (
            <button
              className="text-xs text-muted-foreground hover:text-primary"
              onClick={() => setShowAdminLogin(false)}
            >
              ← Back to {role === "alumni" ? "Alumni" : "Student"} Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

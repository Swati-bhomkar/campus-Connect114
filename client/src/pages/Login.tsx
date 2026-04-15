import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

// API Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (location.state as any)?.role || "student";
  
  const [loginType, setLoginType] = useState<"email" | "regnum">("email");
  const [email, setEmail] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Determine which identifier to use
      const loginData = {
        password,
        ...(loginType === "email" ? { email } : { registrationNumber }),
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Login successful - redirect to appropriate dashboard
      if (showAdminLogin) {
        navigate("/admin");
      } else if (role === "alumni") {
        navigate("/alumni");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
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
            {!showAdminLogin && (
              <div className="flex gap-2 mb-5">
                <Button
                  variant={loginType === "email" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setLoginType("email")}
                  disabled={isLoading}
                >
                  College Email
                </Button>
                <Button
                  variant={loginType === "regnum" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setLoginType("regnum")}
                  disabled={isLoading}
                >
                  Reg. Number
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {showAdminLogin ? (
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              ) : loginType === "email" ? (
                <div className="space-y-2">
                  <Label htmlFor="email">College Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@klebcahubli.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="regnum">Registration Number</Label>
                  <Input
                    id="regnum"
                    placeholder="223061"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
                />
              </div>

              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  <p className="flex items-center gap-1 text-destructive font-medium">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                onClick={handleLogin}
                disabled={isLoading || !password || (!email && !registrationNumber)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
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
                  disabled={isLoading}
                >
                  Don't have an account? Register
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => navigate("/")}
            disabled={isLoading}
          >
            <ArrowLeft className="h-3 w-3" /> Back to role selection
          </button>
          {!showAdminLogin && (
            <button
              className="text-xs text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setShowAdminLogin(true);
                setError(null);
                setEmail("");
                setRegistrationNumber("");
                setPassword("");
              }}
              disabled={isLoading}
            >
              Admin Login →
            </button>
          )}
          {showAdminLogin && (
            <button
              className="text-xs text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setShowAdminLogin(false);
                setError(null);
                setEmail("");
                setRegistrationNumber("");
                setPassword("");
              }}
              disabled={isLoading}
            >
              ← Back to {role === "alumni" ? "Alumni" : "Student"} Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

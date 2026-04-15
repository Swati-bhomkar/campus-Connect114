import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, AlertCircle, CheckCircle2, SkipForward, ShieldCheck, Loader2 } from "lucide-react";

// API Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DOMAINS = [
  "Software Engineering", "Data Science", "Frontend Development", "Backend Engineering",
  "Full Stack Development", "DevOps", "Machine Learning", "Cybersecurity",
  "Product Management", "Mobile Development", "Cloud Computing", "Data Engineering",
];

const SKILLS_MAP: Record<string, string[]> = {
  "Software Engineering": ["React", "Node.js", "Java", "Python", "System Design", "DSA", "AWS"],
  "Data Science": ["Python", "ML", "TensorFlow", "SQL", "Statistics", "R", "Tableau"],
  "Frontend Development": ["React", "TypeScript", "Tailwind", "CSS", "Figma", "Vue", "Angular"],
  "Backend Engineering": ["Java", "Spring Boot", "Node.js", "Go", "Microservices", "Kafka", "Redis"],
  "Full Stack Development": ["MERN", "Docker", "Git", "REST APIs", "GraphQL", "PostgreSQL"],
  "DevOps": ["AWS", "Kubernetes", "CI/CD", "Terraform", "Docker", "Linux", "Ansible"],
  "Machine Learning": ["Python", "PyTorch", "NLP", "OpenCV", "Deep Learning", "MLOps"],
  "Cybersecurity": ["Networking", "Pentesting", "Linux", "Python", "OWASP", "Forensics"],
  "Product Management": ["Product Strategy", "Analytics", "SQL", "Figma", "A/B Testing"],
  "Mobile Development": ["React Native", "Flutter", "Firebase", "Swift", "Kotlin"],
  "Cloud Computing": ["AWS", "Azure", "GCP", "Docker", "Linux", "Terraform"],
  "Data Engineering": ["Spark", "Airflow", "Python", "Snowflake", "Kafka", "SQL"],
};

export default function StudentRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Identity verification
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState<"idle" | "success" | "error">("idle");

  // Step 2: Account setup
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [passOutYear, setPassOutYear] = useState("");
  const [emailValid, setEmailValid] = useState<boolean | null>(null);

  // Step 3: Domain & Skills (optional)
  const [domain, setDomain] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Registration submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleRegister = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          registrationNumber: regNumber.trim(),
          password,
          confirmPassword,
          email: collegeEmail,
          passOutYear: parseInt(passOutYear),
          domain: domain || null,
          skills: selectedSkills,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSubmissionSuccess(true);
      setTimeout(() => {
        navigate("/student");
      }, 1500);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = (email: string) => {
    setCollegeEmail(email);
    if (email.length > 5) {
      setEmailValid(email.endsWith("@klebcahubli.in"));
    } else {
      setEmailValid(null);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const passwordsMatch = password.length >= 8 && password === confirmPassword;
  const canProceedStep1 = verificationResult === "success";
  const canProceedStep2 = passwordsMatch && emailValid === true && passOutYear !== "";

  const totalSteps = 3;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            CC
          </div>
          <h1 className="text-2xl font-bold text-foreground">Student Registration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
        </div>

        {/* Progress */}
        <div className="mb-6 flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {step === 1 && "Identity Verification"}
              {step === 2 && "Account Setup"}
              {step === 3 && "Domain & Skills"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Verify your identity against college records"}
              {step === 2 && "Set up your password and college details"}
              {step === 3 && "Select your professional domain (optional)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Identity Verification */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      placeholder="Abhishek"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setVerificationResult("idle");
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Nimbal"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setVerificationResult("idle");
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input
                    placeholder="223061"
                    value={regNumber}
                    onChange={(e) => {
                      setRegNumber(e.target.value);
                      setVerificationResult("idle");
                    }}
                  />
                </div>

                {verificationResult === "error" && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                    <p className="flex items-center gap-1 text-destructive font-medium">
                      <AlertCircle className="h-4 w-4" /> You are not authorized to register.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      The name and registration number do not match any record in the college database. Contact admin if this is incorrect.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Account Setup */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password.length > 0 && password.length < 8 && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Must be at least 8 characters
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Passwords do not match
                    </p>
                  )}
                  {passwordsMatch && confirmPassword.length > 0 && (
                    <p className="text-xs text-[hsl(var(--success))] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Passwords match
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>College Email</Label>
                  <Input
                    type="email"
                    placeholder="name@klebcahubli.in"
                    value={collegeEmail}
                    onChange={(e) => validateEmail(e.target.value)}
                  />
                  {emailValid === true && (
                    <p className="text-xs text-[hsl(var(--success))] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Valid college email domain
                    </p>
                  )}
                  {emailValid === false && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Must end with @klebcahubli.in
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Pass-out Year</Label>
                  <Select value={passOutYear} onValueChange={setPassOutYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026, 2027, 2028].map((y) => (
                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Domain & Skills (optional) */}
            {step === 3 && (
              <div className="space-y-4">
                {/* Success Message */}
                {submissionSuccess && (
                  <div className="rounded-md border border-green-300 bg-green-50 p-4 text-sm">
                    <p className="flex items-center gap-2 text-green-800 font-medium">
                      <CheckCircle2 className="h-5 w-5" /> Registration successful!
                    </p>
                    <p className="mt-2 text-xs text-green-700">
                      Redirecting to login...
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {submissionError && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                    <p className="flex items-center gap-1 text-destructive font-medium">
                      <AlertCircle className="h-4 w-4" /> Registration failed
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{submissionError}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Domain</Label>
                  <Select
                    value={domain}
                    onValueChange={(v) => {
                      setDomain(v);
                      setSelectedSkills([]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOMAINS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {domain && (
                  <div className="space-y-2">
                    <Label>Skills (select all that apply)</Label>
                    <div className="flex flex-wrap gap-2">
                      {(SKILLS_MAP[domain] || []).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                            selectedSkills.includes(skill)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground hover:bg-secondary"
                          }`}
                        >
                          {selectedSkills.includes(skill) && <Check className="h-3 w-3" />}
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex gap-3">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              )}
              {step === 1 && (
                <Button
                  className="flex-1"
                  onClick={() => setStep(2)}
                  disabled={!firstName.trim() || !lastName.trim() || !regNumber.trim()}
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              {step === 2 && (
                <Button
                  className="flex-1"
                  onClick={() => setStep(3)}
                  disabled={!canProceedStep2}
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              )}
              {step === 3 && (
                <div className="flex flex-1 gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/student")}
                    disabled={isSubmitting}
                  >
                    <SkipForward className="h-4 w-4 mr-1" /> Skip
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleRegister}
                    disabled={isSubmitting || submissionSuccess}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Registering...
                      </>
                    ) : (
                      <>Create Account</>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <button
            className="text-primary hover:underline"
            onClick={() => navigate("/login", { state: { role: "student" } })}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, X, Send, FileText, BriefcaseBusiness, Lightbulb, HelpCircle, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/mock-data";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  prompt: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: "Improve my resume", icon: <FileText className="h-3.5 w-3.5" />, prompt: "Improve my resume" },
  { label: "Prepare for interview", icon: <BriefcaseBusiness className="h-3.5 w-3.5" />, prompt: "Prepare me for interview" },
  { label: "Suggest skills", icon: <Lightbulb className="h-3.5 w-3.5" />, prompt: "Suggest skills" },
  { label: "How to use platform", icon: <HelpCircle className="h-3.5 w-3.5" />, prompt: "How to use platform" },
];

const SKILL_TRENDS: Record<string, string[]> = {
  "Web Development": ["Next.js", "TypeScript", "GraphQL", "Docker", "AWS", "Tailwind CSS"],
  "Data Science": ["PyTorch", "MLOps", "Apache Spark", "dbt", "LLMs", "Langchain"],
  "Mobile Development": ["Flutter", "React Native", "SwiftUI", "Kotlin Multiplatform"],
  "AI/ML": ["LLMs", "RAG", "Langchain", "Hugging Face", "MLflow", "Vector DBs"],
  "Cybersecurity": ["SOC", "Threat Modeling", "Penetration Testing", "SIEM", "Zero Trust"],
  "Cloud Computing": ["Kubernetes", "Terraform", "Serverless", "AWS CDK", "GCP"],
};

function generateResponse(userMessage: string, user: User): string {
  const msg = userMessage.toLowerCase();

  // Reject off-topic
  const offTopicPatterns = ["weather", "joke", "game", "movie", "news", "hello", "hi there", "how are you", "what's up"];
  if (offTopicPatterns.some(p => msg === p || (msg.length < 20 && msg.includes(p)))) {
    return "I'm your **Career Assistant** — I can only help with resume improvement, interview prep, skill suggestions, and platform guidance. Please select one of the quick actions or ask a career-related question.";
  }

  // Resume
  if (msg.includes("resume")) {
    const missingSkills = (SKILL_TRENDS[user.domain] || SKILL_TRENDS["Web Development"])
      .filter(s => !user.skills.map(sk => sk.toLowerCase()).includes(s.toLowerCase()))
      .slice(0, 4);

    return `## Resume Improvement — ${user.name}

Based on your profile as a **${user.domain}** ${user.role}, here are targeted suggestions:

**Your current skills:** ${user.skills.join(", ")}

### Recommendations
1. **Add trending skills** you're missing: ${missingSkills.length > 0 ? missingSkills.join(", ") : "You're well-covered!"}
2. **Quantify achievements** — use metrics like "Improved load time by 40%" instead of vague descriptions
3. **Add projects section** — include 2-3 relevant projects with tech stack and outcomes
4. **Tailor your summary** — lead with your domain: "${user.domain}" and years of experience
${user.role === "student" ? "\n5. **Include internships and hackathons** — these carry weight for entry-level roles" : ""}

💡 *Upload your resume using the upload button for a detailed analysis.*`;
  }

  // Interview
  if (msg.includes("interview")) {
    const domain = user.domain;
    const questions: Record<string, string[]> = {
      "Web Development": [
        "Explain the difference between SSR and CSR. When would you choose each?",
        "How does the Virtual DOM work in React?",
        "Describe RESTful API design principles.",
        "What is CORS and how do you handle it?",
      ],
      "Data Science": [
        "Explain the bias-variance tradeoff.",
        "When would you use Random Forest vs Gradient Boosting?",
        "How do you handle missing data in a dataset?",
        "Explain cross-validation and why it matters.",
      ],
    };
    const qs = questions[domain] || questions["Web Development"];

    return `## Interview Prep — ${domain}

Based on your skills (${user.skills.slice(0, 4).join(", ")}), here are practice questions:

${qs.map((q, i) => `**Q${i + 1}.** ${q}`).join("\n\n")}

### Tips for Your Level
- ${user.role === "student" ? "Focus on **fundamentals and projects** — interviewers expect you to explain what you've built" : "Emphasize **system design and leadership** — show how you've scaled solutions"}
- Prepare **STAR method** responses for behavioral rounds
- Practice coding on platforms like LeetCode (focus on medium difficulty)

Would you like sample answers for any of these questions?`;
  }

  // Skills
  if (msg.includes("skill")) {
    const trending = SKILL_TRENDS[user.domain] || SKILL_TRENDS["Web Development"];
    const have = user.skills.map(s => s.toLowerCase());
    const missing = trending.filter(s => !have.includes(s.toLowerCase()));
    const matched = trending.filter(s => have.includes(s.toLowerCase()));

    return `## Skill Analysis — ${user.domain}

**Your skills:** ${user.skills.join(", ")}

### Trending Skills in ${user.domain}
${trending.map(s => `- ${have.includes(s.toLowerCase()) ? "✅" : "🔸"} ${s}`).join("\n")}

### Gap Analysis
${missing.length > 0 ? `You're missing **${missing.length}** trending skills: **${missing.join(", ")}**` : "Great coverage! You have all trending skills."}
${matched.length > 0 ? `\nYou already have: **${matched.join(", ")}** ✅` : ""}

### Recommended Learning Path
${missing.slice(0, 3).map((s, i) => `${i + 1}. **${s}** — high demand in ${user.domain} roles`).join("\n")}`;
  }

  // Platform guidance
  if (msg.includes("platform") || msg.includes("how to") || msg.includes("referral") || msg.includes("connect") || msg.includes("use")) {
    if (user.role === "student") {
      return `## Platform Guide — Students

### How to Get Referrals
1. Go to **Discovery** → find alumni at your target company
2. Send a **Connection Request** with purpose "Referral"
3. Once connected, go to **My Referrals** → **Create Referral Request**
4. Upload your resume and specify the job role
5. Wait for the alumni to review and respond

### Tips for Success
- **Build your profile** — add all skills and a professional bio
- **Engage with posts** — read alumni job postings and referral opportunities
- **Maintain reputation** — quality interactions increase your score
- **Be specific** — mention the exact role and company when requesting referrals

### Key Pages
- **Discovery** — browse and filter alumni profiles
- **Connections** — manage your professional network
- **Posts** — read job openings and achievements
- **My Referrals** — track all your referral requests`;
    }
    return `## Platform Guide — Alumni

### How to Help Students
1. Set your **availability** in Profile settings
2. Review incoming **Referral Requests** in the Requests tab
3. Accept/reject based on skill match score
4. Post **Job Openings** or **Referral Opportunities**

### Managing Your Limits
- Set **monthly referral cap** to control volume
- Set **daily resume review cap** for manageable workload
- Toggle availability on/off anytime

### Key Pages
- **Requests** — review and manage student referral requests
- **Posts** — share job openings and opportunities
- **Settings** — configure availability and limits`;
  }

  // Fallback for career-adjacent
  return `I can help you with:

1. **📄 Resume Improvement** — personalized feedback based on your ${user.domain} profile
2. **🎯 Interview Preparation** — domain-specific questions and tips
3. **💡 Skill Suggestions** — gap analysis against trending skills
4. **📖 Platform Guidance** — how to use CampusConnect Pro effectively

Please select a quick action below or ask about one of these topics.`;
}

interface CareerChatbotProps {
  user: User;
}

export function CareerChatbot({ user }: CareerChatbotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: `Hi ${user.name.split(" ")[0]}! 👋 I'm your **Career Assistant**.\n\nI can help you with resume improvement, interview prep, skill suggestions, and platform guidance.\n\nSelect a quick action or type your question below.`,
        timestamp: new Date(),
      }]);
    }
  }, [open, user.name, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text, user);
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      sendMessage("I tried to upload an invalid file type.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      sendMessage("My resume file was too large.");
      return;
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: `📎 Uploaded resume: **${file.name}**`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: `## Resume Analysis — ${file.name}

I've reviewed your resume. Here's my analysis based on your **${user.domain}** profile:

### ✅ Strengths Detected
- Skills section includes relevant technologies: ${user.skills.slice(0, 3).join(", ")}
- Clear contact information section

### ⚠️ Areas for Improvement
1. **Missing quantified achievements** — add metrics to your experience bullets
2. **Projects section** — add 2-3 projects with tech stack, problem solved, and outcome
3. **Skills gap** — consider adding trending skills: ${(SKILL_TRENDS[user.domain] || SKILL_TRENDS["Web Development"]).filter(s => !user.skills.map(sk => sk.toLowerCase()).includes(s.toLowerCase())).slice(0, 3).join(", ")}
4. **Summary/Objective** — add a 2-line professional summary tailored to your target role
5. **Format** — use consistent bullet points and keep to 1 page for ${user.role === "student" ? "entry-level" : "mid-level"} roles

Would you like more detailed suggestions on any of these areas?`,
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }, 1500);

    e.target.value = "";
  };

  // Render markdown-lite (bold, headers, lists)
  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return <h3 key={i} className="text-sm font-bold text-foreground mt-2 mb-1">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("### ")) {
        return <h4 key={i} className="text-xs font-semibold text-foreground mt-2 mb-0.5">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("- ") || line.match(/^\d+\.\s/)) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p key={i} className="text-xs text-foreground/90 ml-2" dangerouslySetInnerHTML={{ __html: formatted }} />;
      }
      if (line.trim() === "") return <br key={i} />;
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className="text-xs text-foreground/90" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[380px] h-[540px] flex flex-col shadow-2xl border-border/80 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold leading-none">Career Assistant</p>
            <p className="text-[10px] opacity-80 mt-0.5">AI-powered career guidance</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-1.5 px-3 py-2 border-b border-border bg-secondary/30 shrink-0 flex-wrap">
        {QUICK_ACTIONS.map(action => (
          <button
            key={action.label}
            onClick={() => sendMessage(action.prompt)}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-2" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-lg px-3 py-2",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}>
                {msg.role === "user" ? (
                  <p className="text-xs" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ) : (
                  <div>{renderContent(msg.content)}</div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-lg px-3 py-2 flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-t border-border bg-card shrink-0">
        <label className="cursor-pointer">
          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
          <div className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-accent transition-colors text-muted-foreground">
            <Upload className="h-4 w-4" />
          </div>
        </label>
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask about career, resume, skills..."
          className="h-8 text-xs flex-1"
        />
        <Button size="icon" className="h-8 w-8 shrink-0" onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}>
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
}

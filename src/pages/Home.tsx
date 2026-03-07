import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, BarChart3, Users, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";

const Home = () => {
  const { isLoggedIn, stages, lessons } = useApp();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-3.5 w-3.5" />
              Your .NET Learning Journey Starts Here
            </div>
            <h1 className="mb-6 font-display text-4xl font-bold tracking-tight md:text-6xl">
              Master <span className="gradient-text">.NET Development</span> Step by Step
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              A structured roadmap with {stages.length} stages, {lessons.length} lessons, video tutorials, and hands-on projects. Track your progress and become a professional .NET developer.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to={isLoggedIn ? "/dashboard" : "/login"}>
                <Button size="lg" className="gap-2 px-8">
                  {isLoggedIn ? "Go to Dashboard" : "Get Started"} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/roadmap">
                <Button variant="outline" size="lg" className="gap-2 px-8">
                  View Roadmap
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Learning Stages", value: stages.length, icon: BookOpen },
              { label: "Video Lessons", value: lessons.length, icon: BarChart3 },
              { label: "Hours of Content", value: "40+", icon: Zap },
              { label: "Active Learners", value: "2.4K+", icon: Users },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <div className="font-display text-2xl font-bold md:text-3xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmap Preview */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold">Structured Learning Path</h2>
            <p className="text-muted-foreground">
              From programming fundamentals to cloud deployment — every stage builds on the last.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-2">
            {stages.map((stage, i) => (
              <Link
                key={stage.id}
                to="/roadmap"
                className="glass-card flex items-center gap-4 p-4 transition-all hover:scale-[1.02] hover:border-primary/30"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
                  {stage.order}
                </div>
                <div>
                  <div className="font-medium">{stage.title}</div>
                  <div className="text-xs text-muted-foreground">{stage.lessonIds.length} lessons</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Built with ❤️ for .NET developers. © 2026 .NET Learning Tracker</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

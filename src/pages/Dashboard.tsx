import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BookOpen, Flame, Trophy, ArrowRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import AchievementBadges from "@/components/AchievementBadges";

const Dashboard = () => {
  const { user, isLoggedIn, stages, lessons, achievements, earnedAchievementIds } = useApp();

  if (!isLoggedIn || !user) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-display text-2xl font-bold">Sign in to view your dashboard</h2>
          <Link to="/login"><Button className="mt-4">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const totalLessons = lessons.length;
  const completedCount = user.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const chartData = stages.map((stage) => {
    const completed = stage.lessonIds.filter((id) => user.completedLessons.includes(id)).length;
    return { name: stage.title.split(" ").slice(0, 2).join(" "), completed, total: stage.lessonIds.length };
  });

  const nextLesson = lessons.find((l) => !user.completedLessons.includes(l.id));
  const bookmarkedLessons = lessons.filter((l) => user.bookmarks.includes(l.id));
  const colors = ["hsl(174,72%,40%)", "hsl(262,60%,55%)", "hsl(210,80%,52%)", "hsl(38,92%,50%)", "hsl(142,60%,40%)"];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
        <p className="text-muted-foreground">Continue your .NET learning journey</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Completed", value: `${completedCount}/${totalLessons}`, icon: BookOpen, sub: `${progressPercent}% done` },
          { label: "Streak", value: `${user.streak} days`, icon: Flame, sub: "Keep it up!" },
          { label: "Bookmarks", value: user.bookmarks.length, icon: Bookmark, sub: "Saved lessons" },
          { label: "Badges", value: Math.floor(completedCount / 3), icon: Trophy, sub: "Achievements" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="mt-1 font-display text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.sub}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-semibold">Progress by Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4">
          {nextLesson && (
            <div className="glass-card glow-border p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Continue Learning</h3>
              <div className="mb-2 text-sm text-muted-foreground">
                {stages.find((s) => s.id === nextLesson.stageId)?.title}
              </div>
              <div className="mb-3 font-medium">{nextLesson.title}</div>
              <div className="mb-4 text-sm text-muted-foreground line-clamp-2">{nextLesson.description}</div>
              <Link to={`/lesson/${nextLesson.id}`}>
                <Button className="w-full gap-2">Continue <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          )}
          {bookmarkedLessons.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="mb-3 font-display text-lg font-semibold">Bookmarked</h3>
              <div className="space-y-2">
                {bookmarkedLessons.slice(0, 3).map((l) => (
                  <Link key={l.id} to={`/lesson/${l.id}`} className="block rounded-lg bg-muted/50 p-3 text-sm transition-colors hover:bg-muted">
                    {l.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="mt-8 glass-card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Achievements</h3>
          <AchievementBadges achievements={achievements} earnedIds={earnedAchievementIds} />
        </div>
      )}

      <div className="mt-8 glass-card p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Overall Progress</h3>
          <span className="text-sm text-muted-foreground">{progressPercent}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

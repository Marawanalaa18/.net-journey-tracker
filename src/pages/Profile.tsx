import { useApp } from "@/context/AppContext";
import { lessons, roadmapStages } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, BookOpen, Flame, Trophy, Calendar } from "lucide-react";

const Profile = () => {
  const { user, isLoggedIn } = useApp();

  if (!isLoggedIn || !user) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-display text-2xl font-bold">Sign in to view your profile</h2>
          <Link to="/login"><Button className="mt-4">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const completedCount = user.completedLessons.length;
  const totalLessons = lessons.length;

  return (
    <div className="container max-w-2xl py-8">
      <div className="glass-card p-8">
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" /> Joined {new Date(user.joinedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Completed", value: completedCount, icon: BookOpen },
            { label: "Streak", value: `${user.streak}d`, icon: Flame },
            { label: "Bookmarks", value: user.bookmarks.length, icon: BookOpen },
            { label: "Badges", value: Math.floor(completedCount / 3), icon: Trophy },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl bg-muted/50 p-4 text-center">
                <Icon className="mx-auto mb-1 h-5 w-5 text-primary" />
                <div className="font-display text-xl font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>

        <h3 className="mb-4 font-display text-lg font-semibold">Stage Progress</h3>
        <div className="space-y-3">
          {roadmapStages.map((stage) => {
            const stageCompleted = stage.lessonIds.filter((id) => user.completedLessons.includes(id)).length;
            const pct = Math.round((stageCompleted / stage.lessonIds.length) * 100);
            return (
              <div key={stage.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{stage.title}</span>
                  <span className="text-muted-foreground">{stageCompleted}/{stage.lessonIds.length}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;

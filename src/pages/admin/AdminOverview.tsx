import { useApp } from "@/context/AppContext";
import { Map, BookOpen, Library, Users } from "lucide-react";

const AdminOverview = () => {
  const { stages, lessons, resources } = useApp();

  const stats = [
    { label: "Roadmap Stages", value: stages.length, icon: Map },
    { label: "Lessons", value: lessons.length, icon: BookOpen },
    { label: "Resources", value: resources.length, icon: Library },
    { label: "Users (mock)", value: 42, icon: Users },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Admin Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverview;

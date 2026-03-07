import { roadmapStages, lessons } from "@/lib/mock-data";
import { useApp } from "@/context/AppContext";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

const Roadmap = () => {
  const { user } = useApp();
  const completed = user?.completedLessons ?? [];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">.NET Learning Roadmap</h1>
        <p className="text-muted-foreground">Follow the path from fundamentals to deployment</p>
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 hidden h-full w-px bg-border md:block" />

        <div className="space-y-6">
          {roadmapStages.map((stage, i) => {
            const stageLessons = lessons.filter((l) => stage.lessonIds.includes(l.id));
            const stageCompleted = stageLessons.filter((l) => completed.includes(l.id)).length;
            const allDone = stageCompleted === stageLessons.length;
            const pct = Math.round((stageCompleted / stageLessons.length) * 100);

            return (
              <div
                key={stage.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
              >
                <div className="glass-card overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold ${
                        allDone
                          ? "bg-success text-success-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {allDone ? <CheckCircle2 className="h-5 w-5" /> : stage.order}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold">{stage.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {stageCompleted}/{stageLessons.length}
                        </span>
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground">{stage.description}</p>

                      {/* Progress bar */}
                      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Lessons */}
                      <div className="space-y-1.5">
                        {stageLessons.map((lesson) => {
                          const done = completed.includes(lesson.id);
                          return (
                            <Link
                              key={lesson.id}
                              to={`/lesson/${lesson.id}`}
                              className="flex items-center gap-3 rounded-lg p-2.5 text-sm transition-colors hover:bg-muted/60"
                            >
                              {done ? (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                              ) : (
                                <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <span className={done ? "text-muted-foreground line-through" : ""}>
                                {lesson.title}
                              </span>
                              <span className="ml-auto text-xs text-muted-foreground">{lesson.duration}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;

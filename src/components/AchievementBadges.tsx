import { Achievement } from "@/lib/achievements";
import { Trophy, Flame, BookOpen, Bookmark, Zap, Crown, Footprints, GraduationCap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Trophy, Flame, BookOpen, Bookmark, Zap, Crown, Footprints, GraduationCap, Brain,
};

interface Props {
  achievements: Achievement[];
  earnedIds: string[];
}

export default function AchievementBadges({ achievements, earnedIds }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {achievements.map((a) => {
        const earned = earnedIds.includes(a.id);
        const Icon = iconMap[a.icon] || Trophy;
        return (
          <div
            key={a.id}
            className={cn(
              "flex flex-col items-center rounded-xl border p-4 text-center transition-all",
              earned
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-muted/30 opacity-50 grayscale"
            )}
          >
            <div className={cn(
              "mb-2 flex h-10 w-10 items-center justify-center rounded-full",
              earned ? "bg-primary/15" : "bg-muted"
            )}>
              <Icon className={cn("h-5 w-5", earned ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div className="text-xs font-semibold">{a.title}</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">{a.description}</div>
          </div>
        );
      })}
    </div>
  );
}

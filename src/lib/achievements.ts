export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge_color: string;
  criteria_type: "lessons_completed" | "stage_completed" | "streak" | "bookmarks";
  criteria_value: number;
  criteria_stage_id: string | null;
  sort_order: number;
}

export function checkAchievements(
  achievements: Achievement[],
  earnedIds: string[],
  completedCount: number,
  streak: number,
  bookmarkCount: number
): Achievement[] {
  return achievements.filter((a) => {
    if (earnedIds.includes(a.id)) return false;
    switch (a.criteria_type) {
      case "lessons_completed":
        return completedCount >= a.criteria_value;
      case "streak":
        return streak >= a.criteria_value;
      case "bookmarks":
        return bookmarkCount >= a.criteria_value;
      default:
        return false;
    }
  });
}

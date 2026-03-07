export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  streak: number;
  completedLessons: string[];
  bookmarks: string[];
  joinedAt: string;
}

export interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  color: string;
  lessonIds: string[];
}

export interface Lesson {
  id: string;
  stageId: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoId?: string;
  resources: Resource[];
  codeSnippet?: string;
  order: number;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: "video" | "article" | "repo" | "book" | "practice";
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description?: string;
}

export interface UserNote {
  id: string;
  lessonId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface UserProgress {
  stageId: string;
  completed: number;
  total: number;
}

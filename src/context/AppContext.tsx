import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, UserNote, RoadmapStage, Lesson, Resource } from "@/lib/types";
import { mockUser, roadmapStages as initialStages, lessons as initialLessons, resources as initialResources } from "@/lib/mock-data";

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isDark: boolean;
  notes: UserNote[];
  stages: RoadmapStage[];
  lessons: Lesson[];
  resources: Resource[];
  login: (email: string, password: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleLessonComplete: (lessonId: string) => void;
  toggleBookmark: (lessonId: string) => void;
  addNote: (lessonId: string, content: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isBookmarked: (lessonId: string) => boolean;
  // Admin CRUD
  addStage: (stage: RoadmapStage) => void;
  updateStage: (stage: RoadmapStage) => void;
  deleteStage: (id: string) => void;
  addLesson: (lesson: Lesson) => void;
  updateLesson: (lesson: Lesson) => void;
  deleteLesson: (id: string) => void;
  addResource: (resource: Resource) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isDark, setIsDark] = useState(true);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [stages, setStages] = useState<RoadmapStage[]>(initialStages);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [resources, setResources] = useState<Resource[]>(initialResources);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const login = useCallback((_email: string, _password: string) => {
    setUser(mockUser);
  }, []);

  const loginAsAdmin = useCallback(() => {
    setUser({ ...mockUser, role: "admin", name: "Admin User" });
  }, []);

  const logout = useCallback(() => setUser(null), []);
  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  const toggleLessonComplete = useCallback((lessonId: string) => {
    setUser((u) => {
      if (!u) return u;
      const completed = u.completedLessons.includes(lessonId)
        ? u.completedLessons.filter((id) => id !== lessonId)
        : [...u.completedLessons, lessonId];
      return { ...u, completedLessons: completed };
    });
  }, []);

  const toggleBookmark = useCallback((lessonId: string) => {
    setUser((u) => {
      if (!u) return u;
      const bookmarks = u.bookmarks.includes(lessonId)
        ? u.bookmarks.filter((id) => id !== lessonId)
        : [...u.bookmarks, lessonId];
      return { ...u, bookmarks };
    });
  }, []);

  const addNote = useCallback((lessonId: string, content: string) => {
    const note: UserNote = {
      id: Date.now().toString(),
      lessonId,
      userId: user?.id || "1",
      content,
      createdAt: new Date().toISOString(),
    };
    setNotes((n) => [...n, note]);
  }, [user]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => user?.completedLessons.includes(lessonId) ?? false,
    [user]
  );

  const isBookmarked = useCallback(
    (lessonId: string) => user?.bookmarks.includes(lessonId) ?? false,
    [user]
  );

  // Admin CRUD
  const addStage = useCallback((stage: RoadmapStage) => setStages((s) => [...s, stage]), []);
  const updateStage = useCallback((stage: RoadmapStage) => setStages((s) => s.map((x) => (x.id === stage.id ? stage : x))), []);
  const deleteStage = useCallback((id: string) => {
    setStages((s) => s.filter((x) => x.id !== id));
    setLessons((l) => l.filter((x) => x.stageId !== id));
  }, []);

  const addLesson = useCallback((lesson: Lesson) => {
    setLessons((l) => [...l, lesson]);
    setStages((s) => s.map((st) => st.id === lesson.stageId ? { ...st, lessonIds: [...st.lessonIds, lesson.id] } : st));
  }, []);
  const updateLesson = useCallback((lesson: Lesson) => setLessons((l) => l.map((x) => (x.id === lesson.id ? lesson : x))), []);
  const deleteLesson = useCallback((id: string) => {
    setLessons((l) => {
      const lesson = l.find((x) => x.id === id);
      if (lesson) {
        setStages((s) => s.map((st) => st.id === lesson.stageId ? { ...st, lessonIds: st.lessonIds.filter((lid) => lid !== id) } : st));
      }
      return l.filter((x) => x.id !== id);
    });
  }, []);

  const addResource = useCallback((resource: Resource) => setResources((r) => [...r, resource]), []);
  const updateResource = useCallback((resource: Resource) => setResources((r) => r.map((x) => (x.id === resource.id ? resource : x))), []);
  const deleteResource = useCallback((id: string) => setResources((r) => r.filter((x) => x.id !== id)), []);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === "admin",
        isDark,
        notes,
        stages,
        lessons,
        resources,
        login,
        loginAsAdmin,
        logout,
        toggleTheme,
        toggleLessonComplete,
        toggleBookmark,
        addNote,
        isLessonCompleted,
        isBookmarked,
        addStage, updateStage, deleteStage,
        addLesson, updateLesson, deleteLesson,
        addResource, updateResource, deleteResource,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

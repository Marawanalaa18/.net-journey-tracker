import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, UserNote } from "@/lib/types";
import { mockUser } from "@/lib/mock-data";

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  isDark: boolean;
  notes: UserNote[];
  login: (email: string, password: string) => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleLessonComplete: (lessonId: string) => void;
  toggleBookmark: (lessonId: string) => void;
  addNote: (lessonId: string, content: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isBookmarked: (lessonId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isDark, setIsDark] = useState(true);
  const [notes, setNotes] = useState<UserNote[]>([]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const login = useCallback((_email: string, _password: string) => {
    setUser(mockUser);
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

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isDark,
        notes,
        login,
        logout,
        toggleTheme,
        toggleLessonComplete,
        toggleBookmark,
        addNote,
        isLessonCompleted,
        isBookmarked,
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

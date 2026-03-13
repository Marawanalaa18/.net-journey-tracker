import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { User, UserNote, RoadmapStage, Lesson, Resource } from "@/lib/types";
import { Achievement, checkAchievements } from "@/lib/achievements";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isDark: boolean;
  notes: UserNote[];
  stages: RoadmapStage[];
  lessons: Lesson[];
  resources: Resource[];
  achievements: Achievement[];
  earnedAchievementIds: string[];
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string, name: string) => Promise<string | null>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function mapDbStage(row: any, lessonIds: string[]): RoadmapStage {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    order: row.sort_order,
    icon: row.icon,
    color: row.color,
    lessonIds,
  };
}

function mapDbLesson(row: any): Lesson {
  return {
    id: row.id,
    stageId: row.stage_id,
    title: row.title,
    description: row.description,
    videoId: row.video_id || undefined,
    codeSnippet: row.code_snippet || undefined,
    order: row.sort_order,
    duration: row.duration,
    difficulty: row.difficulty,
    resources: [],
  };
}

function mapDbResource(row: any): Resource {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    type: row.type,
    topic: row.topic,
    difficulty: row.difficulty,
    description: row.description || undefined,
  };
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [stages, setStages] = useState<RoadmapStage[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievementIds, setEarnedAchievementIds] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Fetch public data (stages, lessons, resources, achievements)
  const fetchPublicData = useCallback(async () => {
    const [stagesRes, lessonsRes, resourcesRes, achievementsRes] = await Promise.all([
      supabase.from("roadmap_stages").select("*").order("sort_order"),
      supabase.from("lessons").select("*").order("sort_order"),
      supabase.from("resources").select("*"),
      supabase.from("achievements").select("*").order("sort_order"),
    ]);

    const dbLessons = (lessonsRes.data || []).map(mapDbLesson);
    const dbStages = (stagesRes.data || []).map((s: any) => {
      const ids = dbLessons.filter((l) => l.stageId === s.id).map((l) => l.id);
      return mapDbStage(s, ids);
    });
    const dbResources = (resourcesRes.data || []).map(mapDbResource);
    const dbAchievements: Achievement[] = (achievementsRes.data || []).map((a: any) => ({
      id: a.id, title: a.title, description: a.description, icon: a.icon,
      badge_color: a.badge_color, criteria_type: a.criteria_type,
      criteria_value: a.criteria_value, criteria_stage_id: a.criteria_stage_id,
      sort_order: a.sort_order,
    }));

    setStages(dbStages);
    setLessons(dbLessons);
    setResources(dbResources);
    setAchievements(dbAchievements);
  }, []);

  // Fetch user-specific data
  const fetchUserData = useCallback(async (uid: string) => {
    const [profileRes, completedRes, bookmarksRes, notesRes, rolesRes, earnedRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", uid).single(),
      supabase.from("completed_lessons").select("lesson_id").eq("user_id", uid),
      supabase.from("bookmarks").select("lesson_id").eq("user_id", uid),
      supabase.from("notes").select("*").eq("user_id", uid),
      supabase.from("user_roles").select("role").eq("user_id", uid),
      supabase.from("user_achievements").select("achievement_id").eq("user_id", uid),
    ]);

    const profile = profileRes.data;
    const completed = (completedRes.data || []).map((r: any) => r.lesson_id);
    const bmarks = (bookmarksRes.data || []).map((r: any) => r.lesson_id);
    const earned = (earnedRes.data || []).map((r: any) => r.achievement_id);
    const userNotes: UserNote[] = (notesRes.data || []).map((n: any) => ({
      id: n.id,
      lessonId: n.lesson_id,
      userId: n.user_id,
      content: n.content,
      createdAt: n.created_at,
    }));
    const hasAdmin = (rolesRes.data || []).some((r: any) => r.role === "admin");

    setCompletedLessons(completed);
    setBookmarks(bmarks);
    setNotes(userNotes);
    setIsAdmin(hasAdmin);
    setEarnedAchievementIds(earned);

    if (profile) {
      setUser({
        id: uid,
        name: profile.name || "",
        email: profile.email || "",
        avatar: profile.avatar_url || "",
        role: hasAdmin ? "admin" : "user",
        streak: profile.streak || 0,
        completedLessons: completed,
        bookmarks: bmarks,
        joinedAt: profile.created_at,
      });
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchPublicData();
    if (authUser) fetchUserData(authUser.id);
  }, [fetchPublicData, fetchUserData, authUser]);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const su = session?.user ?? null;
      setAuthUser(su);
      if (su) {
        // defer to avoid deadlock
        setTimeout(() => fetchUserData(su.id), 0);
      } else {
        setUser(null);
        setIsAdmin(false);
        setCompletedLessons([]);
        setBookmarks([]);
        setNotes([]);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      const su = session?.user ?? null;
      setAuthUser(su);
      if (su) fetchUserData(su.id);
      setLoading(false);
    });

    fetchPublicData();

    return () => subscription.unsubscribe();
  }, [fetchPublicData, fetchUserData]);

  // Keep user object in sync with completedLessons/bookmarks
  useEffect(() => {
    if (user) {
      setUser((u) => u ? { ...u, completedLessons, bookmarks } : u);
    }
  }, [completedLessons, bookmarks]);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }, []);

  const register = useCallback(async (email: string, password: string, name: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
    });
    return error ? error.message : null;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const toggleTheme = useCallback(() => setIsDark((d) => !d), []);

  const toggleLessonComplete = useCallback(async (lessonId: string) => {
    if (!authUser) return;
    const isCompleted = completedLessons.includes(lessonId);
    if (isCompleted) {
      await supabase.from("completed_lessons").delete().eq("user_id", authUser.id).eq("lesson_id", lessonId);
      setCompletedLessons((c) => c.filter((id) => id !== lessonId));
    } else {
      await supabase.from("completed_lessons").insert({ user_id: authUser.id, lesson_id: lessonId });
      setCompletedLessons((c) => [...c, lessonId]);
    }
  }, [authUser, completedLessons]);

  const toggleBookmark = useCallback(async (lessonId: string) => {
    if (!authUser) return;
    const isMarked = bookmarks.includes(lessonId);
    if (isMarked) {
      await supabase.from("bookmarks").delete().eq("user_id", authUser.id).eq("lesson_id", lessonId);
      setBookmarks((b) => b.filter((id) => id !== lessonId));
    } else {
      await supabase.from("bookmarks").insert({ user_id: authUser.id, lesson_id: lessonId });
      setBookmarks((b) => [...b, lessonId]);
    }
  }, [authUser, bookmarks]);

  const addNote = useCallback(async (lessonId: string, content: string) => {
    if (!authUser) return;
    const { data } = await supabase.from("notes").insert({ user_id: authUser.id, lesson_id: lessonId, content }).select().single();
    if (data) {
      setNotes((n) => [...n, { id: data.id, lessonId: data.lesson_id, userId: data.user_id, content: data.content, createdAt: data.created_at }]);
    }
  }, [authUser]);

  const isLessonCompleted = useCallback((lessonId: string) => completedLessons.includes(lessonId), [completedLessons]);
  const isBookmarked = useCallback((lessonId: string) => bookmarks.includes(lessonId), [bookmarks]);

  // Admin CRUD - stages
  const addStage = useCallback(async (stage: RoadmapStage) => {
    await supabase.from("roadmap_stages").insert({
      id: stage.id, title: stage.title, description: stage.description,
      sort_order: stage.order, icon: stage.icon, color: stage.color,
    });
    setStages((s) => [...s, stage]);
  }, []);

  const updateStage = useCallback(async (stage: RoadmapStage) => {
    await supabase.from("roadmap_stages").update({
      title: stage.title, description: stage.description,
      sort_order: stage.order, icon: stage.icon, color: stage.color,
    }).eq("id", stage.id);
    setStages((s) => s.map((x) => (x.id === stage.id ? stage : x)));
  }, []);

  const deleteStage = useCallback(async (id: string) => {
    await supabase.from("roadmap_stages").delete().eq("id", id);
    setStages((s) => s.filter((x) => x.id !== id));
    setLessons((l) => l.filter((x) => x.stageId !== id));
  }, []);

  // Admin CRUD - lessons
  const addLesson = useCallback(async (lesson: Lesson) => {
    await supabase.from("lessons").insert({
      id: lesson.id, stage_id: lesson.stageId, title: lesson.title,
      description: lesson.description, video_id: lesson.videoId || null,
      code_snippet: lesson.codeSnippet || null, sort_order: lesson.order,
      duration: lesson.duration, difficulty: lesson.difficulty,
    });
    setLessons((l) => [...l, lesson]);
    setStages((s) => s.map((st) => st.id === lesson.stageId ? { ...st, lessonIds: [...st.lessonIds, lesson.id] } : st));
  }, []);

  const updateLesson = useCallback(async (lesson: Lesson) => {
    await supabase.from("lessons").update({
      stage_id: lesson.stageId, title: lesson.title, description: lesson.description,
      video_id: lesson.videoId || null, code_snippet: lesson.codeSnippet || null,
      sort_order: lesson.order, duration: lesson.duration, difficulty: lesson.difficulty,
    }).eq("id", lesson.id);
    setLessons((l) => l.map((x) => (x.id === lesson.id ? lesson : x)));
  }, []);

  const deleteLesson = useCallback(async (id: string) => {
    const lesson = lessons.find((x) => x.id === id);
    await supabase.from("lessons").delete().eq("id", id);
    setLessons((l) => l.filter((x) => x.id !== id));
    if (lesson) {
      setStages((s) => s.map((st) => st.id === lesson.stageId ? { ...st, lessonIds: st.lessonIds.filter((lid) => lid !== id) } : st));
    }
  }, [lessons]);

  // Admin CRUD - resources
  const addResource = useCallback(async (resource: Resource) => {
    await supabase.from("resources").insert({
      id: resource.id, title: resource.title, url: resource.url,
      type: resource.type, topic: resource.topic, difficulty: resource.difficulty,
      description: resource.description || "",
    });
    setResources((r) => [...r, resource]);
  }, []);

  const updateResource = useCallback(async (resource: Resource) => {
    await supabase.from("resources").update({
      title: resource.title, url: resource.url, type: resource.type,
      topic: resource.topic, difficulty: resource.difficulty,
      description: resource.description || "",
    }).eq("id", resource.id);
    setResources((r) => r.map((x) => (x.id === resource.id ? resource : x)));
  }, []);

  const deleteResource = useCallback(async (id: string) => {
    await supabase.from("resources").delete().eq("id", id);
    setResources((r) => r.filter((x) => x.id !== id));
  }, []);

  // Auto-check and grant new achievements
  useEffect(() => {
    if (!authUser || achievements.length === 0) return;
    const newlyEarned = checkAchievements(
      achievements, earnedAchievementIds,
      completedLessons.length, user?.streak ?? 0, bookmarks.length
    );
    if (newlyEarned.length > 0) {
      const inserts = newlyEarned.map((a) => ({ user_id: authUser.id, achievement_id: a.id }));
      supabase.from("user_achievements").insert(inserts).then(() => {
        setEarnedAchievementIds((prev) => [...prev, ...newlyEarned.map((a) => a.id)]);
      });
    }
  }, [authUser, completedLessons, bookmarks, achievements, earnedAchievementIds, user?.streak]);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!authUser,
        isAdmin,
        isDark,
        notes,
        stages,
        lessons,
        resources,
        achievements,
        earnedAchievementIds,
        loading,
        login,
        register,
        loginWithGoogle,
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
        refreshData,
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

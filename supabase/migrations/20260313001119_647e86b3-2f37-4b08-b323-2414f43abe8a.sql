
CREATE TABLE public.achievements (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Trophy',
  badge_color text NOT NULL DEFAULT 'primary',
  criteria_type text NOT NULL CHECK (criteria_type IN ('lessons_completed', 'stage_completed', 'streak', 'bookmarks')),
  criteria_value integer NOT NULL DEFAULT 1,
  criteria_stage_id text REFERENCES public.roadmap_stages(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  achievement_id text NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

INSERT INTO public.achievements (id, title, description, icon, badge_color, criteria_type, criteria_value, criteria_stage_id, sort_order) VALUES
  ('first-lesson', 'First Step', 'Complete your first lesson', 'Footprints', 'primary', 'lessons_completed', 1, NULL, 1),
  ('five-lessons', 'Getting Started', 'Complete 5 lessons', 'BookOpen', 'primary', 'lessons_completed', 5, NULL, 2),
  ('ten-lessons', 'Dedicated Learner', 'Complete 10 lessons', 'GraduationCap', 'primary', 'lessons_completed', 10, NULL, 3),
  ('twenty-lessons', 'Knowledge Seeker', 'Complete 20 lessons', 'Brain', 'primary', 'lessons_completed', 20, NULL, 4),
  ('streak-3', 'On Fire', '3-day learning streak', 'Flame', 'destructive', 'streak', 3, NULL, 5),
  ('streak-7', 'Week Warrior', '7-day learning streak', 'Zap', 'destructive', 'streak', 7, NULL, 6),
  ('streak-30', 'Monthly Master', '30-day learning streak', 'Crown', 'destructive', 'streak', 30, NULL, 7),
  ('bookworm', 'Bookworm', 'Bookmark 5 lessons', 'Bookmark', 'secondary', 'bookmarks', 5, NULL, 8);

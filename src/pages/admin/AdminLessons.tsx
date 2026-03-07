import { useApp } from "@/context/AppContext";
import { Lesson } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const emptyLesson = (): Lesson => ({
  id: `l${Date.now()}`,
  stageId: "",
  title: "",
  description: "",
  videoId: "",
  order: 1,
  duration: "30 min",
  difficulty: "beginner",
  resources: [],
});

const AdminLessons = () => {
  const { stages, lessons, addLesson, updateLesson, deleteLesson } = useApp();
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [stageFilter, setStageFilter] = useState("all");

  const filtered = stageFilter === "all" ? lessons : lessons.filter((l) => l.stageId === stageFilter);

  const startAdd = () => {
    const newLesson = emptyLesson();
    newLesson.stageId = stages[0]?.id || "";
    setEditing(newLesson);
    setIsNew(true);
  };

  const startEdit = (lesson: Lesson) => {
    setEditing({ ...lesson });
    setIsNew(false);
  };

  const save = () => {
    if (!editing || !editing.title.trim() || !editing.stageId) return;
    if (isNew) addLesson(editing);
    else updateLesson(editing);
    setEditing(null);
    setIsNew(false);
  };

  const cancel = () => { setEditing(null); setIsNew(false); };

  const handleDelete = (id: string) => {
    if (confirm("Delete this lesson?")) deleteLesson(id);
  };

  const diffColors: Record<string, string> = {
    beginner: "bg-success/10 text-success",
    intermediate: "bg-warning/10 text-warning",
    advanced: "bg-destructive/10 text-destructive",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage Lessons</h1>
        <Button onClick={startAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Lesson</Button>
      </div>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <Button variant={stageFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStageFilter("all")}>All Stages</Button>
        {stages.map((s) => (
          <Button key={s.id} variant={stageFilter === s.id ? "default" : "outline"} size="sm" onClick={() => setStageFilter(s.id)}>
            {s.title.split(" ").slice(0, 2).join(" ")}
          </Button>
        ))}
      </div>

      {editing && (
        <div className="mb-6 glass-card p-5">
          <h3 className="mb-4 font-display text-lg font-semibold">{isNew ? "New Lesson" : "Edit Lesson"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Stage</label>
              <select value={editing.stageId} onChange={(e) => setEditing({ ...editing, stageId: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {stages.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">YouTube Video ID</label>
              <input value={editing.videoId || ""} onChange={(e) => setEditing({ ...editing, videoId: e.target.value })} placeholder="e.g. dQw4w9WgXcQ" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Duration</label>
              <input value={editing.duration} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Difficulty</label>
              <select value={editing.difficulty} onChange={(e) => setEditing({ ...editing, difficulty: e.target.value as Lesson["difficulty"] })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Order</label>
              <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 1 })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save} size="sm" className="gap-1"><Check className="h-3.5 w-3.5" /> Save</Button>
            <Button onClick={cancel} variant="outline" size="sm" className="gap-1"><X className="h-3.5 w-3.5" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((lesson) => {
          const stage = stages.find((s) => s.id === lesson.stageId);
          return (
            <div key={lesson.id} className="glass-card flex items-center justify-between p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{lesson.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${diffColors[lesson.difficulty]}`}>{lesson.difficulty}</span>
                </div>
                <div className="text-xs text-muted-foreground">{stage?.title} · {lesson.duration} · Order {lesson.order}</div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(lesson)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(lesson.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="py-8 text-center text-muted-foreground">No lessons found.</div>}
      </div>
    </div>
  );
};

export default AdminLessons;

import { useApp } from "@/context/AppContext";
import { RoadmapStage } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const emptyStage = (): RoadmapStage => ({
  id: `s${Date.now()}`,
  title: "",
  description: "",
  order: 0,
  icon: "Code2",
  color: "primary",
  lessonIds: [],
});

const AdminStages = () => {
  const { stages, addStage, updateStage, deleteStage } = useApp();
  const [editing, setEditing] = useState<RoadmapStage | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startAdd = () => {
    setEditing({ ...emptyStage(), order: stages.length + 1 });
    setIsNew(true);
  };

  const startEdit = (stage: RoadmapStage) => {
    setEditing({ ...stage });
    setIsNew(false);
  };

  const save = () => {
    if (!editing || !editing.title.trim()) return;
    if (isNew) addStage(editing);
    else updateStage(editing);
    setEditing(null);
    setIsNew(false);
  };

  const cancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this stage and all its lessons?")) deleteStage(id);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage Stages</h1>
        <Button onClick={startAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Stage</Button>
      </div>

      {editing && (
        <div className="mb-6 glass-card p-5">
          <h3 className="mb-4 font-display text-lg font-semibold">{isNew ? "New Stage" : "Edit Stage"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Order</label>
              <input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save} size="sm" className="gap-1"><Check className="h-3.5 w-3.5" /> Save</Button>
            <Button onClick={cancel} variant="outline" size="sm" className="gap-1"><X className="h-3.5 w-3.5" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {stages.sort((a, b) => a.order - b.order).map((stage) => (
          <div key={stage.id} className="glass-card flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-display text-sm font-bold text-primary">
                {stage.order}
              </div>
              <div>
                <div className="font-medium">{stage.title}</div>
                <div className="text-xs text-muted-foreground">{stage.lessonIds.length} lessons · {stage.description.slice(0, 60)}{stage.description.length > 60 ? "..." : ""}</div>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => startEdit(stage)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(stage.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStages;

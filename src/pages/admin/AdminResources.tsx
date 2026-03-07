import { useApp } from "@/context/AppContext";
import { Resource } from "@/lib/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

const emptyResource = (): Resource => ({
  id: `r${Date.now()}`,
  title: "",
  url: "",
  type: "article",
  topic: "",
  difficulty: "beginner",
  description: "",
});

const AdminResources = () => {
  const { resources, addResource, updateResource, deleteResource } = useApp();
  const [editing, setEditing] = useState<Resource | null>(null);
  const [isNew, setIsNew] = useState(false);

  const startAdd = () => { setEditing(emptyResource()); setIsNew(true); };
  const startEdit = (r: Resource) => { setEditing({ ...r }); setIsNew(false); };
  const save = () => {
    if (!editing || !editing.title.trim()) return;
    if (isNew) addResource(editing);
    else updateResource(editing);
    setEditing(null); setIsNew(false);
  };
  const cancel = () => { setEditing(null); setIsNew(false); };
  const handleDelete = (id: string) => { if (confirm("Delete this resource?")) deleteResource(id); };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Manage Resources</h1>
        <Button onClick={startAdd} className="gap-2"><Plus className="h-4 w-4" /> Add Resource</Button>
      </div>

      {editing && (
        <div className="mb-6 glass-card p-5">
          <h3 className="mb-4 font-display text-lg font-semibold">{isNew ? "New Resource" : "Edit Resource"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Title</label>
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">URL</label>
              <input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Type</label>
              <select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as Resource["type"] })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="video">Video</option>
                <option value="article">Article</option>
                <option value="repo">Repository</option>
                <option value="book">Book</option>
                <option value="practice">Practice</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Topic</label>
              <input value={editing.topic} onChange={(e) => setEditing({ ...editing, topic: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Difficulty</label>
              <select value={editing.difficulty} onChange={(e) => setEditing({ ...editing, difficulty: e.target.value as Resource["difficulty"] })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <input value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save} size="sm" className="gap-1"><Check className="h-3.5 w-3.5" /> Save</Button>
            <Button onClick={cancel} variant="outline" size="sm" className="gap-1"><X className="h-3.5 w-3.5" /> Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {resources.map((r) => (
          <div key={r.id} className="glass-card flex items-center justify-between p-4">
            <div className="min-w-0 flex-1">
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.type} · {r.topic} · {r.difficulty}</div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => startEdit(r)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminResources;

import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { ExternalLink, Search, Video, FileText, Github, BookOpen, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const typeIcons: Record<string, React.ElementType> = {
  video: Video, article: FileText, repo: Github, book: BookOpen, practice: Code2,
};
const typeColors: Record<string, string> = {
  video: "bg-destructive/10 text-destructive", article: "bg-info/10 text-info", repo: "bg-foreground/10 text-foreground", book: "bg-accent/10 text-accent", practice: "bg-success/10 text-success",
};

const Resources = () => {
  const { resources } = useApp();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [diffFilter, setDiffFilter] = useState("all");

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.topic.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (typeFilter === "all" || r.type === typeFilter) && (diffFilter === "all" || r.difficulty === diffFilter);
  });

  const types = ["all", "video", "article", "repo", "book", "practice"];
  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Resources Library</h1>
        <p className="text-muted-foreground">Curated resources to accelerate your .NET learning</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (<Button key={t} variant={typeFilter === t ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(t)} className="capitalize">{t}</Button>))}
          </div>
          <div className="mx-2 hidden w-px bg-border md:block" />
          <div className="flex flex-wrap gap-1.5">
            {difficulties.map((d) => (<Button key={d} variant={diffFilter === d ? "default" : "outline"} size="sm" onClick={() => setDiffFilter(d)} className="capitalize">{d}</Button>))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((resource, i) => {
          const Icon = typeIcons[resource.type] || FileText;
          return (
            <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer" className="glass-card group animate-fade-in p-5 transition-all hover:scale-[1.02] hover:border-primary/30" style={{ animationDelay: `${i * 40}ms`, opacity: 0 }}>
              <div className="mb-3 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[resource.type]}`}><Icon className="h-3 w-3" />{resource.type}</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mb-1 font-medium">{resource.title}</h3>
              {resource.description && <p className="mb-3 text-sm text-muted-foreground">{resource.description}</p>}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded bg-muted px-2 py-0.5">{resource.topic}</span>
                <span className="capitalize">{resource.difficulty}</span>
              </div>
            </a>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="py-16 text-center text-muted-foreground">No resources found matching your filters.</div>}
    </div>
  );
};

export default Resources;

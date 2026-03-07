import { useParams, Link } from "react-router-dom";
import { lessons, roadmapStages } from "@/lib/mock-data";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Bookmark, BookmarkCheck, ArrowLeft, ArrowRight, Clock, BarChart3 } from "lucide-react";
import { useState } from "react";

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isLessonCompleted, isBookmarked, toggleLessonComplete, toggleBookmark, addNote, notes } = useApp();
  const [noteText, setNoteText] = useState("");

  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 font-display text-2xl font-bold">Lesson not found</h2>
          <Link to="/roadmap"><Button variant="outline">Back to Roadmap</Button></Link>
        </div>
      </div>
    );
  }

  const stage = roadmapStages.find((s) => s.id === lesson.stageId);
  const completed = isLessonCompleted(lesson.id);
  const bookmarked = isBookmarked(lesson.id);
  const lessonNotes = notes.filter((n) => n.lessonId === lesson.id);

  const currentIndex = lessons.findIndex((l) => l.id === id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const handleAddNote = () => {
    if (noteText.trim()) {
      addNote(lesson.id, noteText.trim());
      setNoteText("");
    }
  };

  const difficultyColors: Record<string, string> = {
    beginner: "bg-success/10 text-success",
    intermediate: "bg-warning/10 text-warning",
    advanced: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="container max-w-4xl py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/roadmap" className="hover:text-foreground">Roadmap</Link>
        <span>/</span>
        <span>{stage?.title}</span>
        <span>/</span>
        <span className="text-foreground">{lesson.title}</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[lesson.difficulty]}`}>
            {lesson.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {lesson.duration}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <BarChart3 className="h-3 w-3" /> Lesson {lesson.order}
          </span>
        </div>
        <h1 className="mb-2 font-display text-3xl font-bold">{lesson.title}</h1>
        <p className="text-muted-foreground">{lesson.description}</p>
      </div>

      {/* Video */}
      {lesson.videoId && (
        <div className="mb-8 overflow-hidden rounded-xl border border-border">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${lesson.videoId}`}
              title={lesson.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button
          onClick={() => toggleLessonComplete(lesson.id)}
          variant={completed ? "default" : "outline"}
          className="gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          {completed ? "Completed" : "Mark as Complete"}
        </Button>
        <Button
          onClick={() => toggleBookmark(lesson.id)}
          variant="outline"
          className="gap-2"
        >
          {bookmarked ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
      </div>

      {/* Notes */}
      <div className="mb-8 glass-card p-6">
        <h3 className="mb-4 font-display text-lg font-semibold">Personal Notes</h3>
        <div className="mb-4 flex gap-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note about this lesson..."
            className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={3}
          />
        </div>
        <Button onClick={handleAddNote} size="sm" disabled={!noteText.trim()}>
          Add Note
        </Button>
        {lessonNotes.length > 0 && (
          <div className="mt-4 space-y-2">
            {lessonNotes.map((note) => (
              <div key={note.id} className="rounded-lg bg-muted/50 p-3 text-sm">
                <p>{note.content}</p>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {new Date(note.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        {prevLesson ? (
          <Link to={`/lesson/${prevLesson.id}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {prevLesson.title}
            </Button>
          </Link>
        ) : <div />}
        {nextLesson ? (
          <Link to={`/lesson/${nextLesson.id}`}>
            <Button variant="ghost" className="gap-2">
              {nextLesson.title} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};

export default LessonPage;

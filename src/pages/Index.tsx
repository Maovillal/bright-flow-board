import { useState, useEffect } from "react";
import { KanbanColumn } from "@/components/KanbanColumn";
import { ChatPanel } from "@/components/ChatPanel";
import { fetchTasks, createTask, moveTask, deleteTask } from "@/lib/tasks";
import type { Task, TaskStatus, TaskPriority } from "@/types/kanban";
import { toast } from "sonner";
import { Loader2, LayoutDashboard } from "lucide-react";

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (task: {
    title: string;
    description: string;
    priority: TaskPriority;
    due_date: string | null;
    status: TaskStatus;
  }) => {
    try {
      const created = await createTask(task);
      setTasks((prev) => [...prev, created]);
      toast.success("Task created");
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleMove = async (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await moveTask(id, status);
    } catch {
      toast.error("Failed to move task");
      load();
    }
  };

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
      toast.success("Task deleted");
    } catch {
      toast.error("Failed to delete task");
      load();
    }
  };

  const tasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-foreground leading-tight">Kanban Board</h1>
            <p className="text-xs text-muted-foreground">Organize your work beautifully</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasksByStatus(status)}
                onAdd={handleAdd}
                onMove={handleMove}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Chat */}
      <ChatPanel />
    </div>
  );
};

export default Index;

import { useState } from "react";
import { Plus, X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { TaskPriority, TaskStatus } from "@/types/kanban";

interface AddTaskFormProps {
  status: TaskStatus;
  onAdd: (task: { title: string; description: string; priority: TaskPriority; due_date: string | null; status: TaskStatus }) => void;
}

export function AddTaskForm({ status, onAdd }: AddTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      status,
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate(undefined);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add task
      </button>
    );
  }

  return (
    <div className="bg-card rounded-xl p-4 shadow-card space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">New Task</span>
        <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-background/50"
        autoFocus
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-background/50 resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
          <SelectTrigger className="flex-1 bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 bg-background/50 justify-start">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {dueDate ? format(dueDate, "MMM d") : "Due date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
          </PopoverContent>
        </Popover>
      </div>
      <Button onClick={handleSubmit} className="w-full" disabled={!title.trim()}>
        Add Task
      </Button>
    </div>
  );
}

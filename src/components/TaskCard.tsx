import { useState } from "react";
import { MoreHorizontal, ArrowRight, ArrowLeft, Trash2, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Task, TaskStatus } from "@/types/kanban";
import { PRIORITY_LABELS } from "@/types/kanban";

interface TaskCardProps {
  task: Task;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const MOVE_OPTIONS: Record<TaskStatus, { label: string; status: TaskStatus; icon: typeof ArrowRight }[]> = {
  todo: [
    { label: "Move to In Progress", status: "in_progress", icon: ArrowRight },
    { label: "Move to Done", status: "done", icon: ArrowRight },
  ],
  in_progress: [
    { label: "Move to To Do", status: "todo", icon: ArrowLeft },
    { label: "Move to Done", status: "done", icon: ArrowRight },
  ],
  done: [
    { label: "Move to To Do", status: "todo", icon: ArrowLeft },
    { label: "Move to In Progress", status: "in_progress", icon: ArrowLeft },
  ],
};

export function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColor = {
    high: "bg-priority-high/15 text-priority-high border-priority-high/30",
    medium: "bg-primary/15 text-primary border-primary/30",
    low: "bg-priority-low/15 text-priority-low border-priority-low/30",
  }[task.priority];

  return (
    <div
      className="group bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Badge variant="outline" className={`text-xs mb-2 ${priorityColor}`}>
            {PRIORITY_LABELS[task.priority]}
          </Badge>
          <h4 className="font-semibold text-sm text-foreground leading-tight">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`p-1 rounded-md hover:bg-muted transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
            >
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {MOVE_OPTIONS[task.status].map((opt) => (
              <DropdownMenuItem key={opt.status} onClick={() => onMove(task.id, opt.status)}>
                <opt.icon className="w-4 h-4 mr-2" />
                {opt.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {task.due_date && (
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {format(new Date(task.due_date), "MMM d, yyyy")}
        </div>
      )}
    </div>
  );
}

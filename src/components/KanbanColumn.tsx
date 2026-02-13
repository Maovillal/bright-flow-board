import type { Task, TaskStatus, TaskPriority } from "@/types/kanban";
import { COLUMN_CONFIG } from "@/types/kanban";
import { TaskCard } from "@/components/TaskCard";
import { AddTaskForm } from "@/components/AddTaskForm";

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAdd: (task: { title: string; description: string; priority: TaskPriority; due_date: string | null; status: TaskStatus }) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export function KanbanColumn({ status, tasks, onAdd, onMove, onDelete }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status];

  return (
    <div className="flex flex-col min-w-[320px] max-w-[380px] flex-1">
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className={`w-3 h-3 rounded-full ${config.color}`} />
        <h3 className="font-serif text-lg font-medium text-foreground">{config.label}</h3>
        <span className="ml-auto text-sm text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onMove={onMove} onDelete={onDelete} />
        ))}
        <AddTaskForm status={status} onAdd={onAdd} />
      </div>
    </div>
  );
}

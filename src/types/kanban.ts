export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string | null;
  status: TaskStatus;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const COLUMN_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: "To Do", color: "bg-brulee" },
  in_progress: { label: "In Progress", color: "bg-lunar" },
  done: { label: "Done", color: "bg-secondary" },
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

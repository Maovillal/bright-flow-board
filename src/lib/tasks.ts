import { supabase } from "@/integrations/supabase/client";
import type { Task, TaskStatus } from "@/types/kanban";

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return data as Task[];
}

export async function createTask(task: { title: string; description?: string; priority?: string; due_date?: string | null; status?: string }): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert([task])
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function moveTask(id: string, newStatus: TaskStatus): Promise<Task> {
  return updateTask(id, { status: newStatus });
}

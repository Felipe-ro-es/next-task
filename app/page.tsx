import Link from "next/link";
import { getTasks, createTask, deleteTask, editTask, toggleComplete } from "./actions/tasks";
import FormTasks, { FormTasksType } from "@/components/FormTasks";
import TaskList from "@/components/TaskList";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; title?: string; description?: string }>;
}) {
  const { id, title, description } = await searchParams;

  const tasks = await getTasks();

  async function handleSubmit(data: FormTasksType) {
    "use server";
    await createTask(data);
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    await deleteTask({ id });
  }

  async function handleComplete(formData: FormData) {
    "use server";
    const id = Number(formData.get("id"));
    await toggleComplete(id);
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">📝 Lista de Tarefas</h1>

      <FormTasks
        defaultValues={{
          id: id ? parseInt(id) : undefined,
          title: title || "",
          description: description || "",
        }}
        onSubmit={handleSubmit}
      />

      <TaskList tasks={tasks} onDelete={handleDelete} onComplete={handleComplete} />
    </main>
  );
}

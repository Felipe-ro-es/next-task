import { redirect } from 'next/navigation';
import { editTask } from '../actions/tasks';
import FormTasks, { FormTasksType } from '@/components/FormTasks';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; title?: string; description?: string }>;
}) {
  const { id, title, description } = await searchParams;

  async function handleSubmit(data: FormTasksType) {
    'use server';
    await editTask(data);
    redirect('/');
    
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">📝 Lista de Tarefas</h1>

      <FormTasks
        defaultValues={{
          id: id ? parseInt(id) : undefined,
          title: title || '',
          description: description || '',
        }}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

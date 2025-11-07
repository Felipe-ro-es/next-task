import Link from 'next/link';
import { getTasks, createTask, deleteTask, editTask } from './actions/tasks';
import FormTasks, { FormTasksType } from '@/components/FormTasks';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; title?: string; description?: string }>;
}) {
  const { id, title, description } = await searchParams;
  const tasks = await getTasks();

  async function handleSubmit(data: FormTasksType) {
    'use server';
    await createTask(data);
  }

  async function handleDelete(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    await deleteTask({ id });
  }

  async function handleComplete(formData: FormData) {
    'use server';
    const id = Number(formData.get('id'));
    const task = tasks.find((t: any) => t.id === id);
    if (task) {
      await editTask({ ...task, status: 'done' });
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">📝 Lista de Tarefas</h1>

      <FormTasks
        defaultValues={{
          id: id ? parseInt(id) : undefined,
          title: title || '',
          description: description || '',
        }}
        onSubmit={handleSubmit}
      />

      {/* 🔎 Filtros por status (feito no cliente via componente abaixo) */}
      <TaskList
        tasks={tasks}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />
    </main>
  );
}

// Componente client-side de filtragem e renderização da lista
'use client';
import { useState } from 'react';
import { number } from 'zod';

function TaskList({
  tasks,
  onDelete,
  onComplete,
}: {
  tasks: any[];
  onDelete: (formData: FormData) => Promise<void>;
  onComplete: (formData: FormData) => Promise<void>;
}) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const filtered = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <>
      <div className="my-4">
        <button
          onClick={() => setFilter('all')}
          className={`mr-2 ${filter === 'all' ? 'font-bold' : ''}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`mr-2 ${filter === 'pending' ? 'font-bold' : ''}`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilter('done')}
          className={`${filter === 'done' ? 'font-bold' : ''}`}
        >
          Concluídas
        </button>
      </div>

      <ul className="mt-4">
        {filtered.map((t) => (
          <li
            key={t.id}
            className="border-b py-2 flex justify-between items-center"
          >
            <div>
              <h3
                className={`font-bold ${
                  t.status === 'done' ? 'line-through text-gray-500' : ''
                }`}
              >
                {t.title}
              </h3>
              <p>{t.description}</p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/edit/?id=${t.id}&title=${t.title}&description=${t.description}`}
              >
                <button className="text-blue-500">EDIT</button>
              </Link>

              <form action={onDelete}>
                <input type="hidden" name="id" value={t.id} />
                <button className="text-red-500">DELETE</button>
              </form>

              {t.status !== 'done' && (
                <form action={onComplete}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="text-green-500">COMPLETE</button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}


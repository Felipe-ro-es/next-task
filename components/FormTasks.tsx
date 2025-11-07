'use client'
import { useForm } from 'react-hook-form';
export type FormTasksType = {
  title: string;
  description: string;
  id?: number;
  completed?: 'pending' | 'done';
};
function FormTasks({
  onSubmit,
  defaultValues
}: {
  onSubmit: (data: FormTasksType) => Promise<void>;
  defaultValues?: FormTasksType;
}) {
  const { register, handleSubmit } = useForm({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-4">
      <input
        {...register('title')}
        placeholder="Nova tarefa"
        required
        className="border p-2"
      />
      <textarea
        {...register('description')}
        placeholder="Descrição da tarefa"
        required
        className="border p-2 mt-2"
      />
      <input type="hidden" {...register('id')} />
      <button type="submit" className="ml-2 bg-blue-500 text-white p-2 rounded">
        Adicionar
      </button>
    </form>
  );
}

export default FormTasks;

'use server';

import { FormTasksType } from '@/components/FormTasks';
import API from '@/lib/API';
import { revalidatePath } from 'next/cache';
import { id } from 'zod/locales';



export async function getTasks() {
  try {
    const { data } = await API.get('/tasks');
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function createTask(formData: FormTasksType) {
  try {
    const { title, description } = formData;
    const { data } = await API.post('/tasks', { title, description });
    revalidatePath('/');
    return { success: true, task: data };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false };
  }
}

export async function editTask(formData: FormTasksType) {
  try {
    const { id, title, description } = formData;
    const { data } = await API.put(`/tasks/${id}`, { title, description });
    revalidatePath('/');
    return { success: true, task: data };
  } catch (error) {
    console.error('Error editing task:', error);
    return { success: false };
  }
}


export async function getTaskById(id: number) {
  try {
    const { data } = await API.get(`/tasks/${id}`);
    return data;
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
}

export async function deleteTask(formData: FormTasksType) {
  try {
    const { id } = formData;
    await API.delete(`/tasks/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false };
  }
  
}

export async function toggleComplete(id: number) {
  try {
    await API.patch(`/tasks/${id}`, {
      completed: true,
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.log("Error completing task:", e);
    return { success: false };
  }
}


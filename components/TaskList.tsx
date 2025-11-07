"use client";

import { useState } from "react";
import Link from "next/link";

export default function TaskList({
  tasks,
  onDelete,
  onComplete,
}: {
  tasks: any[];
  onDelete: (formData: FormData) => Promise<void>;
  onComplete: (formData: FormData) => Promise<void>;
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "pending") return !t.completed;
    if (filter === "done") return t.completed === true;
  });

  return (
    <>
      <div className="my-4">
        <button
          onClick={() => setFilter("all")}
          className={`mr-2 ${filter === "all" ? "font-bold" : ""}`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`mr-2 ${filter === "pending" ? "font-bold" : ""}`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilter("done")}
          className={`${filter === "done" ? "font-bold" : ""}`}
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
                  t.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {t.title}
              </h3>
              <p>{t.description}</p>
            </div>

            <div className="flex gap-2">
              {!t.completed && (
                <Link
                  href={`/edit/?id=${t.id}&title=${t.title}&description=${t.description}`}
                >
                  <button className="text-blue-500">EDIT</button>
                </Link>
              )}

              {!t.completed && (
                <form action={onDelete}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="text-red-500">DELETE</button>
                </form>
              )}

              {!t.completed && (
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

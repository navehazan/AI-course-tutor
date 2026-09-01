"use client";

import { useActionState } from "react";
import { createLesson, type LessonFormState } from "./actions";
import styles from "./page.module.css";

const initialState: LessonFormState = {};

export function LessonForm() {
  const [state, formAction, pending] = useActionState(createLesson, initialState);

  return (
    <form action={formAction} className={styles.form}>
      <input name="title" placeholder="Lesson title" className={styles.field} />
      {state.errors?.title && (
        <p className={styles.error}>{state.errors.title[0]}</p>
      )}

      <textarea
        name="content"
        placeholder="Lesson content"
        rows={4}
        className={styles.field}
      />
      {state.errors?.content && (
        <p className={styles.error}>{state.errors.content[0]}</p>
      )}

      <button type="submit" className={styles.addButton} disabled={pending}>
        {pending ? "Adding..." : "Add lesson"}
      </button>
    </form>
  );
}
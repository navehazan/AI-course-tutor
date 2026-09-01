"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createLesson, type LessonFormState } from "./actions";
import styles from "./page.module.css";
import { LessonFields } from "./lesson-fields";

const initialState: LessonFormState = {};

export function LessonForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prevState: LessonFormState, formData: FormData) => {
      const result = await createLesson(prevState, formData);
      if (result.success) {
        setIsOpen(false);
      }
      return result;
    },
    initialState
  );

  // סגור → רק כפתור
  if (!isOpen) {
    return (
      <button
        type="button"
        className={styles.openFormButton}
        onClick={() => setIsOpen(true)}
      >
        + Add lesson
      </button>
    );
  }

  // פתוח → הטופס
  return <LessonFields
    formAction={formAction}
    state={state}
    pending={pending}
    submitLabel="Add lesson"
    onCancel={() => setIsOpen(false)}
  />
  
}
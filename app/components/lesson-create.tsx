"use client";

import { useState } from "react";
import { useActionState } from "react";
import { createLesson, type LessonFormState } from "../actions";
import styles from "./lessons.module.css";
import { LessonForm } from "./lesson-form";

const initialState: LessonFormState = {};

export function LessonCreate() {
  const [isOpen, setIsOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prevState: LessonFormState, formData: FormData) => {
      const result = await createLesson(prevState, formData);
      if (result.success) {
        setIsOpen(false);
      }
      else {
        setShowErrors(true);
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
  return <LessonForm
    formAction={formAction}
    showErrors={showErrors}
    state={state}
    pending={pending}
    submitLabel="Add lesson"
    onCancel={() => {setIsOpen(false); setShowErrors(false);}}
  />
  
}
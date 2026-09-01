"use client";

import type { LessonFormState } from "./actions";
import styles from "./page.module.css";

type Props = {
  formAction: (formData: FormData) => void;
  state: LessonFormState;
  pending: boolean;
  defaultTitle?: string;
  defaultContent?: string;
  lessonId?: number;         // רק בעריכה
  submitLabel: string;       // "Add lesson" / "Save"
  onCancel: () => void;
  showErrors: boolean;
};

export function LessonForm({
  formAction, state, pending,
  defaultTitle = "", defaultContent = "",
  lessonId, submitLabel, onCancel,
  showErrors,
}: Props) {
  return (
    <form action={formAction} className={styles.editForm}>
      {lessonId != null && <input type="hidden" name="id" value={lessonId} />}

      <input
        name="title"
        placeholder="Lesson title"
        defaultValue={defaultTitle}
        className={styles.field}
      />
      {state.errors?.title && showErrors && (
        <p className={styles.error}>{state.errors.title[0]}</p>
      )}

      <textarea
        name="content"
        placeholder="Lesson content"
        defaultValue={defaultContent}
        rows={4}
        className={styles.field}
      />
      {state.errors?.content && showErrors && (
        <p className={styles.error}>{state.errors.content[0]}</p>
      )}

      <div className={styles.cardActions}>
        <button type="submit" className={`${styles.cardButton} ${styles.addButton}`} disabled={pending}>
          {pending ? "…" : submitLabel}
        </button>
        <button type="button" className={`${styles.cardButton} ${styles.deleteButton}`} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
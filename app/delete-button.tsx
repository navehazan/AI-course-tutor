"use client";

import { deleteLesson } from "./actions";
import styles from "./page.module.css";

export function DeleteButton({ id }: { id: number }) {
  return (
    <button
      type="button"
      className={styles.deleteButton}
      onClick={() => deleteLesson(id)}
    >
      Delete
    </button>
  );
}
"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateLesson, type LessonFormState } from "./actions";
import { DeleteButton } from "./delete-button";
import styles from "./page.module.css";
import { LessonFields } from "./lesson-fields";

const initialState: LessonFormState = {};

type Lesson = { id: number; title: string; content: string };

export function LessonCard({ lesson }: { lesson: Lesson }) {
    const [isEditing, setIsEditing] = useState(false);

    const [state, formAction, pending] = useActionState(
      async (prevState: LessonFormState, formData: FormData) => {
        const result = await updateLesson(prevState, formData);   
        if (result.success) {
          setIsEditing(false);                                     
        }
        return result;                                             
      },
      initialState
    );
    if (isEditing) {
        return (
            <LessonFields
            formAction={formAction}
            state={state}
            pending={pending}
            defaultTitle={lesson.title}
            defaultContent={lesson.content}
            lessonId={lesson.id}
            submitLabel="Save"
            onCancel={() => setIsEditing(false)}
          />
        );
    }


  // מצב צפייה
  return (
    <li className={styles.card}>
      <h3 className={styles.cardTitle}>{lesson.title}</h3>
      <p className={styles.cardBody}>{lesson.content}</p>
      <div className={styles.cardActions}>

      <button
        type="button"
        className={`${styles.cardButton} ${styles.addButton}` }
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
      <DeleteButton id={lesson.id} />
      </div>
    </li>
  );
}
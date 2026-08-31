import { db } from "@/db";
import { lessons } from "@/db/schema";
import { Tutor } from "./tutor";
import styles from "./page.module.css";
import { LessonForm } from "./lesson-form";

export default async function Home() {
  const allLessons = await db.select().from(lessons);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Course Lessons</h1>
        <p className={styles.tagline}>Add lessons, then ask the tutor about them.</p>
      </header>

      <LessonForm />

      {allLessons.length === 0 ? (
        <p className={styles.empty}>No lessons yet. Add your first one above.</p>
      ) : (
        <ul className={styles.list}>
          {allLessons.map((lesson) => (
            <li key={lesson.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{lesson.title}</h3>
              <p className={styles.cardBody}>{lesson.content}</p>
            </li>
          ))}
        </ul>
      )}

      <Tutor />
    </main>
  );
}
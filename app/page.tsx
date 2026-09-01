import { db } from "@/db";
import { lessons } from "@/db/schema";
import { Tutor } from "./tutor";
import styles from "./page.module.css";
import { LessonCreate } from "./lesson-create";

import { LessonCard } from "./lesson-card";

export default async function Home() {
  const allLessons = await db.select().from(lessons);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Course Lessons</h1>
        <p className={styles.tagline}>Add lessons, then ask the tutor about them.</p>
      </header>

      <LessonCreate />

      {allLessons.length === 0 ? (
        <p className={styles.empty}>No lessons yet. Add your first one above.</p>
      ) : (
        <ul className={styles.list}>
          {allLessons.map((lesson) => (
    <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </ul>
      )}

      <Tutor />
    </main>
  );
}
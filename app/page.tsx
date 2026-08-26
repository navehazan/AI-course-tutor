// app/page.tsx
import { db } from "@/db";              // ← השאר בדיוק את ה-import שהיה לך קודם
import { lessons } from "@/db/schema";  //   (אם היה relative כמו "../db", תשאיר relative)

export default async function Home() {
  const allLessons = await db.select().from(lessons);

  return (
    <main style={{ padding: "2rem", maxWidth: 640, margin: "0 auto" }}>
      <h1>Course Lessons</h1>

      {allLessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <ul>
          {allLessons.map((lesson) => (
            <li key={lesson.id}>
              <strong>{lesson.title}</strong>
              <p>{lesson.content}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
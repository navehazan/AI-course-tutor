// lib/retrieval.ts

// הפונקציה שכתבת מזמן — cosine similarity בין שני וקטורים
function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  type LessonWithEmbedding = {
    id: number;
    title: string;
    content: string;
    embedding: string;   // ה-JSON שנשמר
  };
  
  export function findTopLessons(
    questionVector: number[],
    lessons: LessonWithEmbedding[],
    topN: number = 2
  ) {
    const scored = lessons.map((lesson) => ({
      lesson,
      score: cosineSimilarity(questionVector, JSON.parse(lesson.embedding)),
    }));
  
    scored.sort((a, b) => b.score - a.score);   // מהגבוה לנמוך
    return scored.slice(0, topN);                // top N
  }
// app/actions.ts
"use server";

import { db } from "@/db";
import { lessons } from "@/db/schema";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { embed } from "@/lib/embeddings";   // למעלה עם שאר ה-imports


const anthropic = new Anthropic();

const lessonSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export type LessonFormState = {
  success?: boolean;
  errors?: {
    title?: string[];
    content?: string[];
  };
};

function validateLesson(formData: FormData) {
  return lessonSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
}

export async function deleteLesson(id: number) {
  await db.delete(lessons).where(eq(lessons.id, id));
  revalidatePath("/");
}

export async function createLesson(_prevState: LessonFormState, formData: FormData): Promise<LessonFormState> {
  const result = validateLesson(formData);
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  // ← החדש: מייצרים embedding מהתוכן
  const vector = await embed(result.data.content);

  await db.insert(lessons).values({
    ...result.data,
    embedding: JSON.stringify(vector),   // ← שומרים כ-JSON (מערך → מחרוזת)
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateLesson(
  _prevState: LessonFormState,
  formData: FormData
): Promise<LessonFormState> {
  const result = validateLesson(formData);
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  const id = Number(formData.get("id"));
  await db.update(lessons).set(result.data).where(eq(lessons.id, id));
  revalidatePath("/");
  return { success: true };
}
 

export async function askTutor(question: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: question }],
  });

  const firstBlock = message.content[0];
  return firstBlock.type === "text" ? firstBlock.text : "";
}


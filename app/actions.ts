// app/actions.ts
"use server";

import { db } from "@/db";
import { lessons } from "@/db/schema";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { eq } from "drizzle-orm";

const lessonSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export type LessonFormState = {
  errors?: {
    title?: string[];
    content?: string[];
  };
};

export async function deleteLesson(id: number) {
  await db.delete(lessons).where(eq(lessons.id, id));
  revalidatePath("/");
}

export async function createLesson(_prevState: LessonFormState,formData: FormData): Promise<LessonFormState>  {
  const result = lessonSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  await db.insert(lessons).values(result.data);
  revalidatePath("/");
  return {}; // success: no errors
}

const anthropic = new Anthropic(); 

export async function askTutor(question: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: question }],
  });

  const firstBlock = message.content[0];
  return firstBlock.type === "text" ? firstBlock.text : "";
}


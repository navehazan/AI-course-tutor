import { VoyageAIClient } from "voyageai";

const client = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

export async function embed(text: string): Promise<number[]> {
  const result = await client.embed({
    model: "voyage-4",
    input: text,
  });

  const vector = result.data?.[0]?.embedding;
  if (!vector) {
    throw new Error("Failed to generate embedding");
  }
  return vector;
}
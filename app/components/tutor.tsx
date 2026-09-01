"use client";

import { useState } from "react";
import { askTutor } from "../actions";
import styles from "./tutor.module.css";

export function Tutor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    setLoading(true);
    const result = await askTutor(question);
    setAnswer(result);
    setLoading(false);
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.heading}>Ask the tutor</h2>
      <p className={styles.subtext}>
        Ask anything and get an answer based on the course.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. Explain lesson 3 in simpler terms"
        rows={3}
        className={styles.input}
      />

      <button
        onClick={handleAsk}
        disabled={loading || !question}
        className={styles.button}
      >
        {loading ? "Thinking…" : "Ask"}
      </button>

      {answer && <div className={styles.answer}>{answer}</div>}
    </section>
  );
}
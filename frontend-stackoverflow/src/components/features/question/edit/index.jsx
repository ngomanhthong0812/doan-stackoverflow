import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "@tanstack/react-router";
import AskForm from "../ask/ask-form";
import AskSidebar from "../ask/ask-sidebar";
import { _getQuestionById } from "@/services/question";

export default function QuestionEdit() {
  const { id } = useParams({ from: "/(app)/questions/edit/$id" });
  const [data, setData] = useState(null);

  const didFetch = useRef(false);

  const fetchQuestion = useCallback(async () => {
    try {
      const res = await _getQuestionById(id);
      setData(res);
    } catch (err) {
      console.error("Failed to fetch question:", err);
    }
  }, [id]);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    fetchQuestion();
  }, [fetchQuestion]);

  console.log(data);

  return (
    <section className="flex">
      <main className="flex-1">
        <div className="flex items-center justify-between pl-6">
          <h1 className="!text-2xl font-bold">Edit a question</h1>
        </div>
        <AskForm />
      </main>
      <AskSidebar />
    </section>
  );
}

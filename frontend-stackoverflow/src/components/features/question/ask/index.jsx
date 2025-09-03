import React from "react";
import AskSidebar from "./ask-sidebar";
import AskForm from "./ask-form";

export default function QuestionAsk() {
  return (
    <section className="flex">
      <main className="flex-1">
        <div className="flex items-center justify-between pl-6">
          <h1 className="!text-2xl font-bold">Ask a question</h1>
        </div>
        <AskForm />
      </main>
      <AskSidebar />
    </section>
  );
}

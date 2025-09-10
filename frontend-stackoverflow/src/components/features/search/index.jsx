import { Button } from "@/components/ui/button";
import { Link, useSearch } from "@tanstack/react-router";
import React from "react";
import QuestionFilter from "../question/question-filter";
import QuestionSidebar from "../question/question-sidebar";

export default function Search() {
  const { key } = useSearch({ from: "/(app)/search" });

  return (
    <section className="flex">
      <main className="flex-1">
        <div className="flex items-center justify-between pl-6">
          <h1 className="!text-2xl">{key}</h1>
          <Button
            className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white"
            asChild
          >
            <Link to="/questions/ask">Ask Question</Link>
          </Button>
        </div>
        <QuestionFilter search={key}/>
      </main>
      <QuestionSidebar />
    </section>
  );
}

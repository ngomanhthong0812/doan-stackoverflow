import { Button } from "@/components/ui/button";
import QuestionSidebar from "./question-sidebar";
import QuestionFilter from "./question-filter";
import { Link } from "@tanstack/react-router";

export default function Question() {
  return (
    <section className="flex">
      <main className="flex-1">
        <div className="flex items-center justify-between pl-6">
          <h1 className="!text-2xl">Newest Questions</h1>
          <Button
            className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white"
            asChild
          >
            <Link to="/questions/ask">Ask Question</Link>
          </Button>
        </div>
        <QuestionFilter />
      </main>
      <QuestionSidebar />
    </section>
  );
}

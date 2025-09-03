import { Button } from "@/components/ui/button";
import QuestionSidebar from "./question-sidebar";
import QuestionFilter from "./question-filter";
import QuestionItem from "./question-item";
import { Link } from "@tanstack/react-router";
import Pagination from "../pagination";

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
        <div className="border-t">
          <QuestionItem />
          <QuestionItem />
          <QuestionItem />
        </div>
        <Pagination
          className="pl-6 py-4 mt-6"
          currentPage={1}
          totalPages={1000}
        />
      </main>
      <QuestionSidebar />
    </section>
  );
}

// import { useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import QuestionSidebar from "../question-sidebar";
import { Link } from "@tanstack/react-router";

export default function QuestionDetail() {
  //   const { idName } = useParams({ from: "/(app)/questions/$idName" });
  return (
    <section>
      <main className="flex-1">
        <div className="flex pl-6 justify-between items-center border-b pb-4">
          <div>
            <h1 className="!text-2xl">Tiều đề</h1>
            <div className="text-xs flex gap-4 mt-2">
              <div className="flex gap-1">
                <span className="text-gray-500">Asked</span>
                <span>today</span>
              </div>
              <div className="flex gap-1">
                <span className="text-gray-500">Modified</span>
                <span>today</span>
              </div>
              <div className="flex gap-1">
                <span className="text-gray-500">Viewed </span>
                <span>7 Times</span>
              </div>
            </div>
          </div>
          <Button
            className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white"
            asChild
          >
            <Link to="/questions/ask">Ask Question</Link>
          </Button>
        </div>
        <div className="flex py-4">
          <div className="flex-1">
                
          </div>
          <QuestionSidebar />
        </div>
      </main>
    </section>
  );
}

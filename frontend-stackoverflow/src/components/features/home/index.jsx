import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import { Link } from "@tanstack/react-router";
import WatchedTags from "./watched-tags";
import HomeSidebar from "./home-sidebar";
import { useEffect, useState } from "react";
import QuestionItem from "../question/question-item";
import Pagination from "../pagination";
import { _getQuestionsByTabs } from "@/services/question";
import RenderSkeleton from "../render-skeleton";

export default function Home() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pagination, setPagination] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQues = async () => {
      setLoading(true);
      try {
        const tagIds = selectedTags.map((tag) => tag._id);

        const res = await _getQuestionsByTabs({
          page,
          perPage,
          selectedTags: tagIds,
        });

        setQuestions(res.data);
        setPagination(res.pagination);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedTags.length > 0) {
      fetchQues();
    }
  }, [page, perPage, selectedTags]);

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  console.log(selectedTags);

  return (
    <section>
      <main className="flex-1">
        <div className="flex items-center justify-between pl-6">
          <h1 className="!text-2xl flex gap-2 items-center font-bold">
            <svg
              aria-hidden="true"
              class="as-start fc-blue-400 w48 h48 md:d-none svg-spot spotWave"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="fill-[#1b75d0]"
            >
              <path
                d="M37.96 1.57c.67-.34 1.5-.07 1.84.6l5.42 10.75a1.37 1.37 0 1 1-2.46 1.23L37.35 3.41c-.34-.67-.07-1.5.6-1.84m-3.2 5.9c.69-.31 1.5 0 1.81.69l2.32 5.15a1.37 1.37 0 0 1-2.5 1.13L34.06 9.3c-.31-.7 0-1.5.69-1.82M6.87 35.3a1.37 1.37 0 0 1 1.94-.06l4.64 4.39a1.37 1.37 0 1 1-1.89 2l-4.64-4.39a1.37 1.37 0 0 1-.05-1.94m-5.21 2.38a1.37 1.37 0 0 1 1.94-.06l8.34 7.82a1.37 1.37 0 1 1-1.88 2l-8.34-7.81a1.37 1.37 0 0 1-.06-1.95m14.72-.75c3.22 4.1 7.62 9.71 13.93 9.71q2.77 0 5.65-1.47c5.71-2.92 6.97-6.96 8.55-12.07l.28-.9c1.46-4.67 2.44-8.4 2.7-9.44.56-1.8-.53-3.64-2.43-4.16a3.8 3.8 0 0 0-2.7.27 3.3 3.3 0 0 0-1.7 1.97l-1.82 6.27a.3.3 0 0 1-.25.2q-.2-.04-.27-.17L28.18 4.31c-.9-1.52-2.62-2.05-4.05-1.32-1.52.78-1.85 2.05-1 3.9.87 1.87 5.02 13.3 5.71 15.3q.07.24-.12.35c-.18.07-.3 0-.37-.1L17.9 5.56a2.9 2.9 0 0 0-3.83-1.08c-.67.34-1.13.9-1.32 1.56a2.6 2.6 0 0 0 .3 2.02l9.7 16.55q.1.2-.09.34c-.19.1-.28.04-.37-.06l-9.9-12.16c-.55-.64-1.45-1.4-2.65-1.4q-.72 0-1.42.35-.9.46-1.1 1.33c-.18.71.06 1.55.64 2.3.81 1.06 8.66 11.99 10.22 14.17l.05.06c.07.1.05.25-.05.33a.3.3 0 0 1-.36.01l-9.66-7.57a4 4 0 0 0-2.4-.94q-.64 0-1.23.3c-.35.17-.62.58-.73 1.08-.11.54-.02 1.09.25 1.56.57.97 2.47 2.68 4.49 4.49 2.24 2 4.78 4.28 6.61 6.46.39.46.8.98 1.34 1.67"
                opacity=".2"
              ></path>
              <path d="m11.76 34.62.49.58 2.06 2.56.62.74c4.55 5.47 7.93 7.85 12.87 7.85q3.01 0 6.1-1.58c4.66-2.38 6.58-5.1 8.47-10.81l.58-1.86.43-1.4c1.05-3.4 1.86-6.22 2.57-8.98a4.3 4.3 0 0 0-3.14-5.37l-.21-.06a4.6 4.6 0 0 0-5.41 2.96l-1.27 4.39L26.58 2.6l-.05-.1C25.36.55 23.08-.18 21.16.8c-1.97 1-2.48 2.79-1.55 4.99l.15.32c.4.9 1.56 3.97 2.75 7.18l.53 1.44-6.81-11C15.18 1.97 13 1.5 11.2 2.38l-.18.08c-1.77.95-2.48 2.92-1.36 4.83l4.89 8.33-3.91-4.8A4.5 4.5 0 0 0 7.2 9.04c-3.07 0-4.47 3.05-2.78 5.45l1.7 2.33 3.51 4.86 2.14 2.97-5.63-4.41a5 5 0 0 0-3.02-1.16 2.91 2.91 0 0 0-2.57 4.44l.11.18c.5.77 1.38 1.66 3.25 3.37l3.5 3.16.7.65q1.01.93 1.83 1.77 1.04 1.05 1.81 1.97m4.1 1.88-1.89-2.35-.68-.82a36 36 0 0 0-1.92-2.1l-.59-.57q-.75-.74-1.64-1.57l-1.89-1.7-1.74-1.58c-1.99-1.8-2.87-2.7-3.22-3.3-.41-.7.01-1.43.84-1.43.58 0 1.2.28 1.78.73l9.67 7.57c.55.44 1.31.35 1.75-.17.37-.46.4-1.13.02-1.62L7.1 14.72l-.96-1.3c-.88-1.15-.34-2.38 1.08-2.38.68 0 1.33.39 1.89 1.05L19 24.24c.43.51 1.12.58 1.64.28.57-.34.82-1.07.45-1.7l-9.7-16.55c-.53-.9-.23-1.67.67-2.1.94-.45 1.96-.23 2.45.61L25 21.68c.8 1.3 2.77.33 2.28-1.1l-.57-1.64a378 378 0 0 0-5.17-13.76c-.64-1.39-.47-2.08.54-2.6l.15-.06c.87-.36 1.87-.04 2.5.86l.06.1L34.9 26.26c.47 1.06 2.07.97 2.4-.16l1.81-6.27c.38-1.2 1.84-1.92 3.18-1.55 1.37.37 2.13 1.66 1.74 2.9l-.29 1.1c-.58 2.23-1.24 4.53-2.05 7.17l-.96 3.1-.25.76C38.74 38.58 37.1 40.9 33 43q-2.68 1.36-5.2 1.36c-4.35 0-7.41-2.29-11.93-7.85"></path>
            </svg>
            <div className="flex flex-col">
              Welcome to Stack Overflow, {user?.username}!
              <span className="text-xs font-[400]">
                Find answers to your technical questions and help others answer
                theirs.
              </span>
            </div>
          </h1>
          <Button
            className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white"
            asChild
          >
            <Link to="/questions/ask">Ask Question</Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 mt-8 pl-6">
          <WatchedTags
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>
        {/* <QuestionFilter /> */}
      </main>

      <div className="flex flex-col pl-6 mt-4">
        <h3 className="text-xl font-bold">Interesting posts for you</h3>
        <span className="text-xs">
          Based on your viewing history and watched tags.
        </span>
      </div>
      <div className="flex pl-6 mt-2">
        <div className="flex-1 border rounded-md">
          <div className="border-t">
            {questions &&
              questions.length > 0 &&
              questions.map((question) => (
                <QuestionItem key={question._id} {...question} />
              ))}
            {loading && <RenderSkeleton className="grid-cols-1" length={4} />}
          </div>
          {pagination?.totalPages > 1 && (
            <Pagination
              className="pl-6 py-4 mt-6"
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              onPerPageChange={setPerPage}
            />
          )}
        </div>
        <HomeSidebar />
      </div>
    </section>
  );
}

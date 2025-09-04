import { useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import QuestionSidebar from "../question-sidebar";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { _getQuestionById } from "@/services/questions";
import { formatTimeAgo } from "@/utils/format-time-ago";
import { ThumbsUp } from "lucide-react";
import { useAuth } from "@/contexts/auth";

export default function QuestionDetail() {
  const { id } = useParams({ from: "/(app)/questions/$id" });
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await _getQuestionById(id);
      setData(res);
    };
    fetchQuestion();
  }, [id]);

  return (
    <section>
      <main className="flex-1">
        <div className="flex pl-6 justify-between items-center border-b pb-4">
          <div>
            <h1 className="!text-2xl">{data?.title}</h1>
            <div className="text-xs flex gap-4 mt-2">
              <div className="flex gap-1">
                <span className="text-gray-500">Asked</span>
                <span>{formatTimeAgo(data?.createdAt)}</span>
              </div>
              <div className="flex gap-1">
                <span className="text-gray-500">Modified</span>
                <span>{formatTimeAgo(data?.updatedAt)}</span>
              </div>
              <div className="flex gap-1">
                <span className="text-gray-500">Viewed </span>
                <span>{data?.view || 0}</span>
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
          <div className="flex-1 pl-6 flex flex-col">
            <div
              className="quill-content"
              dangerouslySetInnerHTML={{ __html: data?.content }}
            />

            {/* tags */}
            <ul className="flex flex-wrap gap-2 mt-7">
              {data?.tags.map((t) => (
                <li
                  key={t._id || t}
                  className="inline-flex items-center rounded-sm px-2 py-1 text-xs bg-gray-200 border-gray-500 text-black font-medium"
                >
                  {t.name || t}
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                {/* Vote */}
                <ToggleVote upvotes={data?.upvotes} />
                {/* Comment button */}
                <button className="text-sm text-blue-600 hover:underline">
                  Add Comment
                </button>
                {/* Comment button */}
                <button className="text-sm text-blue-600 hover:underline">
                  Edit
                </button>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-2 text-sm">
                <img
                  src={data?.author.avatar}
                  alt={data?.author.username}
                  className="w-8 h-8 rounded-full border"
                />
                <div>
                  <p className="font-medium">{data?.author.username}</p>
                  <p className="text-xs text-gray-500">
                    Reputation: {data?.author.reputation}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <QuestionSidebar />
        </div>
      </main>
    </section>
  );
}

export function ToggleVote({ upvotes = [] }) {
  const { user } = useAuth();

  const [count, setCount] = useState(upvotes.length);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (user && upvotes) {
      setVoted(upvotes?.includes(user._id));
      setCount(upvotes.length);
    }
  }, [user, upvotes]);

  const handleVote = () => {
    if (voted) {
      setCount(count - 1);
      setVoted(false);
    } else {
      setCount(count + 1);
      setVoted(true);
    }
  };

  return (
    <button
      onClick={handleVote}
      className={`flex items-center gap-2 px-3 py-1 rounded-lg border h-fit transition-colors
        ${voted ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
    >
      <ThumbsUp
        size={18}
        className={voted ? "fill-white text-white" : "text-gray-600"}
      />
      {voted ? "Voted" : "Vote"}
      <span className="font-medium">{count}</span>
    </button>
  );
}

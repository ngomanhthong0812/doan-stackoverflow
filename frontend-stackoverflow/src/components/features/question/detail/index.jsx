import { useNavigate, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import QuestionSidebar from "../question-sidebar";
import { useEffect, useState } from "react";
import {
  _getPendingEdits,
  _getQuestionById,
  _toggleUpvote,
} from "@/services/question";
import { formatTimeAgo } from "@/utils/format-time-ago";
import { ThumbsUp } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import CommentList from "./comment-list";
import AnswerList from "./answer-list";
import { _createAnswer, _toggleLike } from "@/services/answer";
import { useRequireLogin } from "@/hooks/use-require-login";
import { socket } from "@/lib/socket";

export default function QuestionDetail() {
  const { id } = useParams({ from: "/(app)/questions/$id" });
  const { user } = useAuth();

  const navigate = useNavigate();
  const { requireLogin, Dialog } = useRequireLogin();

  const [data, setData] = useState(null);
  const [pendingEdits, setPendingEdits] = useState([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await _getQuestionById(id);
        setData(res);
      } catch (err) {
        console.error("Failed to fetch question:", err);
      }
    };

    fetchQuestion();
  }, [id]);

  useEffect(() => {
    if (!data?.author._id === user._id) return;
    const fetchPendingEdits = async () => {
      try {
        const edits = await _getPendingEdits(id);
        setPendingEdits(edits);
      } catch (err) {
        console.error("Failed to fetch pending edits:", err);
      }
    };

    fetchPendingEdits();
  }, [id, user, data]);

  const handleEdit = () => {
    navigate({ to: `/questions/edit/${data._id}` });
  };
  const handleAdd = (e) => {
    if (!requireLogin()) {
      e.preventDefault();
      return;
    }
    navigate({ to: "/questions/ask" });
  };

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
                <span>{data?.views || 0}</span>
              </div>
            </div>
          </div>
          <Button
            className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white"
            onClick={handleAdd}
          >
            Ask Question
          </Button>
          {Dialog}
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
                <ToggleVote
                  upvotes={data?.upvotes}
                  id={data?._id}
                  type={"question"}
                  targetOwnerId={data?.author._id}
                  questionId={data?._id}
                />

                <button
                  onClick={handleEdit}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-2 text-sm">
                <img
                  src={
                    data?.author.avatar ||
                    "https://avatars.githubusercontent.com/u/000000?v=4"
                  }
                  alt={data?.author.username}
                  className="w-8 h-8 rounded-full border object-cover"
                />
                <div>
                  <p className="font-medium">{data?.author.username}</p>
                  <p className="text-xs text-gray-500">
                    Reputation: {data?.author.reputation}
                  </p>
                </div>
              </div>
            </div>

            {user && data?.author._id === user._id && (
              <ul className="space-y-2 mt-2">
                {pendingEdits.map((edit) => (
                  <li
                    key={edit._id}
                    className="p-2 border rounded bg-yellow-50 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">
                          {edit.editor.username}
                        </span>{" "}
                        suggested an edit
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(edit.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate({
                            to: `/questions/edit-preview/${edit._id}`,
                          })
                        }
                        size="sm"
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <CommentList
              parentId={data?._id}
              parentType="Question"
              targetOwnerId={data?.author._id}
              questionId={data?._id}
            />
            <AnswerList
              questionId={data?._id}
              questionOwnerId={data?.author._id}
            />
          </div>
          <QuestionSidebar />
        </div>
      </main>
    </section>
  );
}

export function ToggleVote({
  upvotes = [],
  targetOwnerId,
  id,
  type,
  questionId,
}) {
  const { user } = useAuth();
  const { requireLogin, Dialog } = useRequireLogin();

  const [count, setCount] = useState(upvotes.length);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (user && upvotes) {
      if (type === "question") {
        setVoted(upvotes?.includes(user._id));
      } else {
        setVoted(upvotes?.some((like) => like.user === user._id));
      }
      setCount(upvotes.length);
    }
  }, [user, upvotes, type]);

  const handleVote = async () => {
    if (!requireLogin()) return;
    try {
      if (type === "question") {
        const res = await _toggleUpvote({ questionId: id });
        setCount(res.count);
        setVoted(res.upvoted);

        if (res.upvoted) {
          socket.emit("newLike", {
            parentType: "Question",
            parentId: id,
            newLike: {
              userId: user._id,
              username: user.username,
            },
            targetOwnerId: targetOwnerId,
            questionId,
          });
        }
      } else {
        const res = await _toggleLike({ answerId: id });
        setCount(res.likeCount);
        setVoted(res.liked);

        if (res.liked) {
          socket.emit("newLike", {
            parentType: "Answer",
            parentId: id,
            newLike: {
              userId: user._id,
              username: user.username,
            },
            targetOwnerId: targetOwnerId,
            questionId,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        onClick={handleVote}
        className={`flex items-center gap-2 px-3 py-1 rounded-lg border h-fit transition-colors
        ${voted ? "bg-[#1b75d0] hover:bg-[#155ca2] text-white" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
      >
        <ThumbsUp
          size={18}
          className={voted ? "fill-white text-white" : "text-gray-600"}
        />
        {voted ? "Voted" : "Vote"}
        <span className="font-medium">{count}</span>
      </button>
      {Dialog}
    </>
  );
}

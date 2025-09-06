import React, { useEffect, useState } from "react";
import { ToggleVote } from ".";
import CommentList from "./comment-list";
import { useAuth } from "@/contexts/auth";
import { useRequireLogin } from "@/hooks/use-require-login";
import { _deleteAnswer, _updateAnswer } from "@/services/answer";
import { toast } from "sonner";
import RichTextEditor from "../ask/rich-text-editor";

export default function AnswerItem({ data, fetchData }) {
  const { user } = useAuth();
  const { requireLogin, Dialog } = useRequireLogin();

  const [openEdit, setOpenEdit] = useState(false);
  const [content, setContent] = useState(data?.content);
  const [newContent, setNewContent] = useState(data?.content);

  useEffect(() => {
    if (data) {
      setContent(data.content);
    }
  }, [data]);

  const handleUpdateAnswer = async () => {
    if (!requireLogin()) return;

    if (data && content && content.length >= 15) {
      try {
        const res = await _updateAnswer({
          content: newContent,
          answerId: data?._id,
        });

        setContent(res.content);
        setOpenEdit(false);
        toast.success("Your answer has been updated successfully!");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update your answer. Please try again.");
      }
    } else {
      toast.error("Your answer must be at least 15 characters long.");
    }
  };

  const handleDelete = async () => {
    try {
      await _deleteAnswer({ answerId: data._id });
      toast.success("Answer deleted!");
      if (fetchData) fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 pl-6 flex flex-col border-b py-4">
      <div
        className="quill-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {/* Vote */}
          <ToggleVote
            upvotes={data?.likes}
            questionId={data?._id}
            type={"answer"}
          />
          {/* Edit button */}
          {user && data?.author._id === user?._id && (
            <>
              <button
                onClick={() => setOpenEdit(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
            </>
          )}

          {/* Remove button */}
          {user && data?.author._id === user?._id && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          )}
        </div>

        {/* Author info */}
        <div className="flex items-center gap-2 text-sm">
          <img
            src={
              data?.author.avata ||
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
      {user && openEdit && data?.author._id === user?._id && (
        <div className="flex flex-col mt-4">
          <RichTextEditor value={newContent} onChange={setNewContent} />
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateAnswer()}
              className={`mt-3 w-fit px-6 py-2 rounded-lg font-medium bg-[#1b75d0] hover:bg-[#155ca2] text-white`}
            >
              Update Answer
            </button>
            <button
              onClick={() => setOpenEdit(false)}
              className={`mt-3 w-fit px-6 py-2 rounded-lg font-medium`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <CommentList parentId={data?._id} parentType="Answer" />
      {Dialog}
    </div>
  );
}

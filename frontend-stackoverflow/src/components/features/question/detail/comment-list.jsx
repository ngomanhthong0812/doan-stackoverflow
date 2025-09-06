import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CommentForm from "./comment-form";
import { _deleteComment, _getComments, _toggleLike } from "@/services/comment";
import { formatTimeAgo } from "@/utils/format-time-ago";
import { useAuth } from "@/contexts/auth";
import { useRequireLogin } from "@/hooks/use-require-login";
import { toast } from "sonner";

import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function CommentList({ parentType, parentId }) {
  const { user } = useAuth();
  const [openNewComment, setOpenNewComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [data, setData] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 2;

  const fetchComments = useCallback(async () => {
    const res = await _getComments({
      parentType,
      parentId,
      page,
      perPage,
    });

    if (page === 1) {
      setComments(res.data);
    } else {
      setComments((prev) => [...prev, ...res.data]);
    }

    setData(res);
  }, [page, parentType, parentId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, page, parentType, parentId]);

  useEffect(() => {
    if (!user) return;

    socket.emit("joinPost", parentId);

    socket.on("receiveComment", (comment) => {
      setComments((prev) => [comment, ...prev]);
    });

    socket.on("receiveReply", (reply) => {
      setComments((prev) =>
        prev.map((c) => {
          if (c._id === reply.parentCommentId) {
            return { ...c, children: [...(c.children || []), reply] };
          }
          return c;
        })
      );
    });

    return () => {
      socket.off("receiveComment");
      socket.off("receiveReply");
    };
  }, [parentId, user]);

  return (
    <section>
      <h1 className="!text-[20px] mt-4 mb-2">{data?.total} Comments</h1>
      <button
        className="text-sm text-blue-600 hover:underline"
        onClick={() => setOpenNewComment((prev) => !prev)}
      >
        Add Comment
      </button>
      <CommentForm
        setOpen={setOpenNewComment}
        open={openNewComment}
        parentType={parentType}
        parentId={parentId}
      />

      <div className="flex flex-col mt-2">
        {comments?.length > 0 &&
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              fetchComments={fetchComments}
            />
          ))}
      </div>

      {data?.totalPages > page && (
        <p
          className="text-sm text-blue-600 hover:underline mt-3 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >
          show {Math.max(data?.total - page * perPage, 0)} more comments
        </p>
      )}
    </section>
  );
}

export function CommentItem({ comment, fetchComments }) {
  const { user } = useAuth();
  const { requireLogin, Dialog } = useRequireLogin();

  const [openReplyComment, setOpenReplyComment] = useState(false);
  const [showChildren, setShowChildren] = useState(false);

  const [count, setCount] = useState(comment.likes?.length);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (user && comment?.likes.length > 0) {
      setVoted(comment?.likes?.some((like) => like.user === user._id));
      setCount(comment?.likes.length);
    }
  }, [user, comment]);

  const toggleLike = async () => {
    if (!requireLogin()) return;
    try {
      const res = await _toggleLike({ commentId: comment._id });
      setCount(res.likeCount);
      setVoted(res.liked);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await _deleteComment({ commentId: comment._id });
      toast.success("Comment deleted!");
      if (fetchComments) fetchComments();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Comment gốc */}
      <div className="flex items-start gap-3 py-3 border-b">
        {/* Avatar */}
        <img
          src={
            comment.author?.avatar ||
            "https://avatars.githubusercontent.com/u/000000?v=4"
          }
          alt={comment.author?.username || "user"}
          className="w-8 h-8 rounded-full border object-cover"
        />

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-[#1b75d0] hover:underline cursor-pointer">
              {comment.author?.username}
            </span>
            <span className="text-gray-500">
              {formatTimeAgo(comment?.createdAt)}
            </span>
          </div>

          {/* Comment text */}
          <p className="text-[13px] mt-1">{comment.content}</p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className={`h-7 px-2 text-xs flex gap-1 
                ${voted ? "bg-[#1b75d0] hover:bg-[#155ca2] text-white" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
              onClick={() => toggleLike()}
            >
              <ThumbsUp size={14} />
              <span>{count || 0}</span>
            </Button>

            {Dialog}

            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs flex gap-1"
              onClick={() => setOpenReplyComment((prev) => !prev)}
            >
              <MessageSquare size={14} />
              Reply
            </Button>

            {user && comment?.author._id === user?._id && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs flex gap-1 text-red-500 hover:text-red-600"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>

          {/* Form reply */}
          <CommentForm
            setOpen={setOpenReplyComment}
            open={openReplyComment}
            parentComment={comment._id}
            parentType={comment.parentType}
            parentId={comment.parentId}
            parentCommentOwner={comment.author._id}
            user={user}
          />

          {/* Reply comments */}
          {comment.children && comment.children.length > 0 && (
            <div className="mt-3 ml-10 border-l pl-4 space-y-3">
              {/* Nút ẩn/hiện replies */}
              <button
                onClick={() => setShowChildren((prev) => !prev)}
                className="text-xs text-blue-600 hover:underline mb-2"
              >
                {showChildren
                  ? `Hide ${comment.children.length} replies`
                  : `Show ${comment.children.length} replies`}
              </button>

              {showChildren &&
                comment.children.map((child) => (
                  <CommentItem key={child._id} comment={child} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

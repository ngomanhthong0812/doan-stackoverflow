import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { _createComments } from "@/services/comment";
import { toast } from "sonner";
import { useRequireLogin } from "@/hooks/use-require-login";
import { useAuth } from "@/contexts/auth";
import { socket } from "@/lib/socket";

export default function CommentForm({
  open = false,
  setOpen,
  parentType,
  parentId,
  parentComment = null,
  targetOwnerId,
  questionId,
}) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const { requireLogin, Dialog } = useRequireLogin();

  if (!open) return null;

  const handleSubmit = async () => {
    if (!requireLogin()) return;
    if (comment.trim().length < 15) {
      toast.error("Comment must be at least 15 characters long.");
      return;
    }

    try {
      const newComment = await _createComments({
        content: comment,
        parentType,
        parentId,
        parentComment,
      });

      toast.success("Your comment has been posted successfully!");
      setComment("");

      // ---- emit socket ----
      if (!user) return;

      if (!parentComment) {
        socket.emit("newComment", {
          parentType,
          parentId,
          newComment,
          targetOwnerId,
          questionId,
        });
      } else {
        socket.emit("newReply", {
          parentType,
          parentId,
          newComment,
          commentOwnerId: targetOwnerId,
          questionId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  return (
    <div className="w-full rounded-sm mt-4">
      <Textarea
        placeholder="Use comments to ask for more information or suggest improvements. Avoid answering questions in comments."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-muted-foreground">
          Enter at least 15 characters
        </span>
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={comment.trim().length < 15}
            className={`${
              comment.trim().length < 15
                ? "bg-[#1b75d0]/40 !cursor-not-allowed text-white"
                : "bg-[#1b75d0] hover:bg-[#155ca2] text-white"
            }`}
          >
            Add comment
          </Button>
          <Button onClick={() => setOpen(false)} className="!bg-transparent">
            Cancel
          </Button>
        </div>
      </div>
      {Dialog}
    </div>
  );
}

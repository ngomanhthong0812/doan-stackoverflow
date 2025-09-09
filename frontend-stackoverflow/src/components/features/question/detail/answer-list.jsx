import { _createAnswer, _getAnswerByQuestionId } from "@/services/answer";
import { useCallback, useEffect, useState } from "react";
import AnswerItem from "./answer-item";
import { toast } from "sonner";
import RichTextEditor from "../ask/rich-text-editor";
import { useRequireLogin } from "@/hooks/use-require-login";
import { socket } from "@/lib/socket";

export default function AnswerList({ questionId, questionOwnerId }) {
  const { requireLogin, Dialog } = useRequireLogin();

  const [answers, setAnswers] = useState([]);
  const [yourAnswer, setYourAnswer] = useState("");

  const fetchData = useCallback(async () => {
    const res = await _getAnswerByQuestionId({ questionId });
    setAnswers(res);
  }, [questionId]);

  useEffect(() => {
    if (!questionId) return;

    fetchData();
  }, [fetchData, questionId]);

  const handleCreateAnswer = async () => {
    if (!requireLogin()) return;
    if (yourAnswer && yourAnswer.length >= 15) {
      try {
        const newAnswer = await _createAnswer({
          content: yourAnswer,
          questionId,
        });

        setYourAnswer("");
        setAnswers((prev) => [newAnswer, ...prev]);
        toast.success("Your answer has been posted successfully!");

        if (socket && questionOwnerId) {
          socket.emit("newAnswer", {
            questionId,
            newAnswer,
            questionOwnerId,
          });
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to post your answer. Please try again.");
      }
    } else {
      toast.error("Your answer must be at least 15 characters long.");
    }
  };

  return (
    <>
      <div className="mt-5">
        <h1 className="!text-[20px] mt-4 mb-2">
          {answers.length || 0} Answers
        </h1>
        <div>
          {answers &&
            answers.length > 0 &&
            answers.map(
              (data) =>
                data?._id && (
                  <AnswerItem
                    key={data._id}
                    data={data}
                    fetchData={fetchData}
                    questionId={questionId}
                  />
                )
            )}
        </div>
      </div>
      <div>
        <h1 className="!text-[20px] my-5">Your Answer</h1>
        <RichTextEditor value={yourAnswer} onChange={setYourAnswer} />
        <button
          onClick={() => handleCreateAnswer()}
          className={`mt-3 px-6 py-2 rounded-lg font-medium bg-[#1b75d0] hover:bg-[#155ca2] text-white`}
        >
          Post Your Answer
        </button>
        {Dialog}
      </div>
    </>
  );
}

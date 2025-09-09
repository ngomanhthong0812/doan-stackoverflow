import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  _getQuestionEditById,
  _getQuestionById,
  _approveQuestionEdit,
  _rejectQuestionEdit,
} from "@/services/question";
import { diffChars } from "diff";

export default function EditPreview() {
  const { id } = useParams({ from: "/(app)/questions/edit-preview/$id" });
  const navigate = useNavigate();

  const [edit, setEdit] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const editRes = await _getQuestionEditById(id);
        setEdit(editRes);

        const questionRes = await _getQuestionById(editRes.question._id);
        setQuestion(questionRes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleApprove = async () => {
    await _approveQuestionEdit(id);
    navigate({ to: `/questions/${edit.question._id}` });
  };

  const handleReject = async () => {
    await _rejectQuestionEdit(id);
    navigate({ to: `/questions/${edit.question._id}` });
  };

  if (!edit || !question) return <p>Loading...</p>;

  const renderHtmlDiff = (oldHtml, newHtml) => {
    const diff = diffChars(oldHtml, newHtml);
    return diff
      .map((part) => {
        if (part.added)
          return `<span class="bg-yellow-200 px-1 rounded">${part.value}</span>`;
        if (part.removed)
          return `<span class="bg-red-200 px-1 rounded line-through">${part.value}</span>`;
        return part.value;
      })
      .join("");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-2">Edit Preview</h1>
      <p className="text-sm text-gray-500 mb-6">
        Suggested by <span className="font-medium">{edit.editor.username}</span>{" "}
        at {new Date(edit.createdAt).toLocaleString()}
      </p>

      <div className="hidden md:flex justify-end gap-2 mb-4">
        <Button
          onClick={handleApprove}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Approve
        </Button>
        <Button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Reject
        </Button>
      </div>

      {/* Title */}
      <div className="border rounded p-4 bg-white shadow-sm">
        <h2 className="font-medium mb-2">Title</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p
            className="text-lg"
            dangerouslySetInnerHTML={{
              __html: renderHtmlDiff(question.title, edit.proposedTitle),
            }}
          />
          <div className="flex md:hidden gap-2 mt-2">
            <Button
              onClick={handleApprove}
              className="bg-green-500 hover:bg-green-600 text-white text-sm"
            >
              Approve
            </Button>
            <Button
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600 text-white text-sm"
            >
              Reject
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Current: {question.title}</p>
      </div>

      {/* Content */}
      <div className="border rounded p-4 bg-white shadow-sm">
        <h2 className="font-medium mb-2">Content</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Original content */}
          <div className="flex-1 border p-2 rounded bg-gray-50">
            <h3 className="text-sm font-semibold mb-1">Original</h3>
            <div
              className="quill-content"
              dangerouslySetInnerHTML={{ __html: question.content }}
            />
          </div>
          {/* Proposed content with diff */}
          <div className="flex-1 border p-2 rounded bg-gray-50">
            <h3 className="text-sm font-semibold mb-1">Proposed</h3>
            <div
              className="quill-content"
              dangerouslySetInnerHTML={{
                __html: renderHtmlDiff(question.content, edit.proposedContent),
              }}
            />
          </div>
        </div>
      </div>

      <div className="border rounded p-4 bg-white shadow-sm">
        <h2 className="font-medium mb-2">Tags</h2>

        {/* Proposed Tags */}
        <div className="flex flex-wrap gap-2 mb-1">
          {edit.proposedTags.map((t) => {
            const exists = question.tags.some((qt) => qt._id === t._id);
            return (
              <span
                key={t._id}
                className={`px-2 py-1 rounded-sm text-xs ${
                  exists ? "bg-gray-200" : "bg-yellow-200"
                }`}
              >
                {t.name}
              </span>
            );
          })}
        </div>

        {/* Deleted Tags */}
        <div className="flex flex-wrap gap-2 mb-1">
          {question.tags
            .filter((qt) => !edit.proposedTags.some((t) => t._id === qt._id))
            .map((t) => (
              <span
                key={t._id}
                className="px-2 py-1 bg-red-200 rounded-sm text-xs line-through"
              >
                {t.name}
              </span>
            ))}
        </div>

        {/* Current Tags */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
          Current:
          {question.tags.map((t) => (
            <span
              key={t._id}
              className="px-2 py-1 bg-gray-200 rounded-sm text-xs"
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>

      {/* Back button */}
      <div className="mt-6">
        <Button onClick={() => navigate(-1)} variant="outline">
          Back
        </Button>
      </div>
    </div>
  );
}

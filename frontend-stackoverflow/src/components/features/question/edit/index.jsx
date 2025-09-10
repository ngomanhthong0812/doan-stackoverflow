import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "@tanstack/react-router";
import AskForm from "../ask/ask-form";
import AskSidebar from "../ask/ask-sidebar";
import { _getEdits, _getQuestionById } from "@/services/question";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function QuestionEdit() {
  const { id } = useParams({ from: "/(app)/questions/edit/$id" });
  const [data, setData] = useState(null);
  const [questionEdits, setQuestionEdits] = useState([]);

  const didFetch = useRef(false);

  const fetchQuestion = useCallback(async () => {
    try {
      const res = await _getQuestionById(id);
      setData(res);
    } catch (err) {
      console.error("Failed to fetch question:", err);
    }
  }, [id]);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchQuestion();
  }, [fetchQuestion]);

  useEffect(() => {
    const fetch = async () => {
      const res = await _getEdits(id);
      setQuestionEdits(res);
    };
    fetch();
  }, [id]);

  const handleChangeRevision = (value) => {
    if (value === "original") {
      fetchQuestion();
    } else {
      const revision = questionEdits.find((edit) => edit._id === value);
      if (revision) {
        setData({
          ...data,
          title: revision.proposedTitle,
          content: revision.proposedContent,
          tags: revision.proposedTags,
        });
      }
    }
  };

  return (
    <section className="flex">
      <main className="flex-1">
        <div className="flex items-center justify-between pl-6">
          <h1 className="!text-2xl font-bold">Edit a question</h1>
        </div>
        {questionEdits && data && questionEdits.length > 0 && (
          <div className="pl-6 mt-4">
            <Label className="block text-sm font-semibold mb-1">Rev</Label>
            <Select
              onValueChange={handleChangeRevision}
              defaultValue={data?.latestEdit?._id}
            >
              <SelectTrigger className="w-full border rounded-sm px-3 py-2 text-sm">
                <SelectValue placeholder="Chọn revision" />
              </SelectTrigger>
              <SelectContent>
                {questionEdits?.map((edit) => (
                  <SelectItem key={edit._id} value={edit._id}>
                    {edit.editor?.username} –{" "}
                    {new Date(edit.createdAt).toLocaleString()} –{" "}
                    {edit.proposedTitle?.length > 30
                      ? edit.proposedTitle.slice(0, 30) + "..."
                      : edit.proposedTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {data && <AskForm defaultValues={data} />}
      </main>
      <AskSidebar />
    </section>
  );
}

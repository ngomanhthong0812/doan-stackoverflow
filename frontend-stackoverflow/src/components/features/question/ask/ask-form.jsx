import React, { useEffect, useState } from "react";
import RichTextEditor from "./rich-text-editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { _getTags } from "@/services/tag";
import { _createQuestions, _updateQuestion } from "@/services/question";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "@tanstack/react-router";

export default function AskForm({ defaultValues }) {
  const router = useRouter();
  const { user } = useAuth();

  const isEdit = !!defaultValues?._id;

  const [title, setTitle] = useState(defaultValues?.title || "");
  const [details, setDetails] = useState(defaultValues?.content || "");
  const [tags, setTags] = useState(defaultValues?.tags || []);
  const [step, setStep] = useState(defaultValues ? 3 : 1);

  useEffect(() => {
    if (defaultValues) {
      setTitle(defaultValues.title || "");
      setDetails(defaultValues.content || "");
      setTags(defaultValues.tags || []);
      setStep(3);
    }
  }, [defaultValues]);

  const handleSubmit = async () => {
    if (!user) return;

    const payload = {
      title,
      content: details,
      tags: tags.map((t) => t._id),
      author: user._id,
    };

    try {
      let res;
      if (isEdit) {
        // Edit
        res = await _updateQuestion({
          questionId: defaultValues._id,
          ...payload,
        });
        toast.success("Question updated successfully");
      } else {
        // Add new
        res = await _createQuestions(payload);
        toast.success("Question created successfully");
      }

      if (res?._id) {
        router.navigate({ to: `/questions/${res._id}` });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit question");
    }
  };

  const titleValid = title.trim().length > 0;
  const detailsValid = details.trim().length >= 20;
  const tagsValid = tags.length > 0;

  return (
    <div className="space-y-6 p-6 pr-0">
      {/* Title */}
      <StepWrapper disabled={false}>
        <Label className="block text-sm font-semibold mb-1">Title</Label>
        <p className="text-xs text-gray-500 mb-2">
          Be specific and imagine you’re asking a question to another person.
        </p>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. How to fix React useEffect infinite loop?"
          className="w-full border rounded-sm px-3 py-2 focus:ring focus:ring-blue-500 outline-none text-sm"
        />
        {step === 1 && (
          <NextButton disabled={!titleValid} onClick={() => setStep(2)} />
        )}
      </StepWrapper>

      {/* Details */}
      <StepWrapper disabled={step < 2}>
        <Label className="block text-sm font-semibold mb-1">
          What are the details of your problem?
        </Label>
        <p className="text-xs text-gray-500 mb-2">
          Introduce the problem and expand on what you put in the title. Minimum
          20 characters.
        </p>
        <RichTextEditor value={details} onChange={setDetails} />
        {step === 2 && (
          <NextButton disabled={!detailsValid} onClick={() => setStep(3)} />
        )}
      </StepWrapper>

      {/* Tags */}
      <StepWrapper disabled={step < 3}>
        <TagsInput tags={tags} setTags={setTags} />
        {step === 3 && (
          <NextButton
            disabled={!tagsValid}
            onClick={handleSubmit}
            label="Submit Question"
          />
        )}
      </StepWrapper>
    </div>
  );
}

function StepWrapper({ children, disabled }) {
  return (
    <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
      {children}
    </div>
  );
}

function NextButton({ disabled, onClick, label = "Next" }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`mt-3 px-6 py-2 rounded-lg font-medium ${
        disabled
          ? "bg-[#1b75d0]/40 !cursor-not-allowed text-white"
          : "bg-[#1b75d0] hover:bg-[#155ca2] text-white"
      }`}
    >
      {label}
    </button>
  );
}

export function TagsInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [tagsData, setTagsData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await _getTags({ page: 1, perPage: 6, search: inputValue });
      setTagsData(res?.data || []);
    };
    fetch();
  }, [inputValue]);

  // Thêm tag
  const handleAddTag = (tag) => {
    let newTags = tags.filter((t) => t._id !== tag._id);

    if (newTags.length >= 5) {
      newTags.shift();
    }

    newTags.push(tag);

    setTags(newTags);
    setInputValue("");
    setShowDropdown(false);
  };

  // Xoá tag
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t._id !== tag._id));
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-1">Tags</label>
      <p className="text-xs text-gray-500 mb-2">
        Add up to 5 tags to describe what your question is about. Start typing
        to see suggestions.
      </p>

      {/* Ô input */}
      <div className="border rounded-lg p-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500">
        {tags.map((tag) => (
          <span
            key={tag._id}
            className="flex items-center gap-1 bg-gray-100 text-gray-700 font-bold px-1 rounded-sm text-xs"
          >
            {tag?.name}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="text-xs font-bold hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="flex-1 min-w-[100px] outline-none text-sm"
          placeholder="e.g. reactjs, javascript"
        />
      </div>

      {/* Dropdown gợi ý */}
      {showDropdown && inputValue && tagsData.length > 0 && (
        <div className="mt-2 border rounded-lg shadow-lg p-2 bg-white overflow-y-auto">
          <div className="grid grid-cols-4 gap-2">
            {tagsData?.map((tag) => (
              <button
                key={tag._id}
                onClick={() => handleAddTag(tag)}
                className="text-sm flex flex-col items-start !p-1"
              >
                <span className="flex items-center gap-1 bg-gray-100 text-gray-700 font-bold px-1 rounded-sm text-xs w-fit p-1">
                  {tag?.name}
                </span>
                <p className="mt-2 line-clamp-5 text-xs">{tag?.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-400 mt-1">
        {tags.length}/5 tags selected
      </p>
    </div>
  );
}

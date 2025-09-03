import React, { useState } from "react";
import RichTextEditor from "./rich-text-editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "react-select";

export default function AskForm() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [attempt, setAttempt] = useState("");
  const [tags, setTags] = useState([]);
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    console.log("Title:", title);
    console.log("Details:", details);
    console.log("Attempt:", attempt);
    console.log("Tags:", tags);
    // TODO: call API tạo câu hỏi
  };

  const titleValid = title.trim().length > 0;
  const detailsValid = details.trim().length >= 20;
  const attemptValid = attempt.trim().length >= 20;
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

      {/* Attempt */}
      <StepWrapper disabled={step < 3}>
        <Label className="block text-sm font-semibold mb-1">
          What did you try and what were you expecting?
        </Label>
        <p className="text-xs text-gray-500 mb-2">
          Describe what you tried, what you expected to happen, and what
          actually resulted. Minimum 20 characters.
        </p>
        <RichTextEditor value={attempt} onChange={setAttempt} />
        {step === 3 && (
          <NextButton disabled={!attemptValid} onClick={() => setStep(4)} />
        )}
      </StepWrapper>

      {/* Tags */}
      <StepWrapper disabled={step < 4}>
        <TagsInput tags={tags} setTags={setTags} />
        {step === 4 && (
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

const tagOptions = [
  { value: "javascript", label: "javascript" },
  { value: "reactjs", label: "reactjs" },
  { value: "nextjs", label: "nextjs" },
  { value: "css", label: "css" },
  { value: "html", label: "html" },
  { value: "nodejs", label: "nodejs" },
];

function TagsInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <label className="block text-sm font-semibold mb-1">Tags</label>
      <p className="text-xs text-gray-500 mb-2">
        Add up to 5 tags to describe what your question is about. Start typing
        to see suggestions.
      </p>

      <Select
        isMulti
        options={tagOptions}
        value={tags}
        onChange={(selected) => {
          if ((selected?.length || 0) <= 5) setTags(selected || []);
        }}
        inputValue={inputValue}
        onInputChange={(val) => setInputValue(val)}
        placeholder="e.g. reactjs, javascript"
        className="text-sm"
        classNamePrefix="react-select"
        maxMenuHeight={160}
        menuIsOpen={inputValue.length > 0}
        filterOption={(option, input) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        }
        components={{
          DropdownIndicator: () => null,
        }}
        noOptionsMessage={() => (inputValue ? "No matching tags" : null)}
      />

      <p className="text-xs text-gray-400 mt-1">
        {tags.length}/5 tags selected
      </p>
    </div>
  );
}

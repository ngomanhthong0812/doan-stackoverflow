import React, { useMemo, useState } from "react";
import { Quill } from "react-quill-new";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import CodeRunnerModal from "../../code-runner-modal";
import { _upload } from "@/services/upload";

const icons = Quill.import("ui/icons");
icons["custom"] = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
stroke-linecap="round" stroke-linejoin="round" 
class="lucide lucide-play-icon lucide-play">
<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
</svg>
`;

export default function RichTextEditor({ value, onChange }) {
  const [openRunCode, setOpenRunCode] = useState(false);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
          ["custom"],
        ],
        handlers: {
          // custom nút Run Code
          custom() {
            setOpenRunCode(true);
          },
          // custom upload ảnh
          image() {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;

              try {
                const res = await _upload(file);

                if (res?.url) {
                  const quill = this.quill;
                  const range = quill.getSelection();
                  quill.insertEmbed(range.index, "image", res.url);
                } else {
                  console.error("Upload failed");
                }
              } catch (err) {
                console.error("Upload image failed:", err);
              }
            };
          },
        },
      },
    }),
    []
  );

  return (
    <div className="border rounded-sm overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="[&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-sm"
      />
      <CodeRunnerModal open={openRunCode} setOpen={setOpenRunCode} />
    </div>
  );
}

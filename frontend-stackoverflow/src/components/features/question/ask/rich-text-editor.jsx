import React, { useMemo, useRef, useState } from "react";
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
  const quillRef = useRef(null);
  const [html, setHtml] = useState("<h1>Hello World</h1>");
  const [css, setCss] = useState("h1 { color: red; }");
  const [js, setJs] = useState("console.log('JS chạy')");
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
          custom() {
            setOpenRunCode(true);
          },
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
                  const quill = quillRef.current.getEditor();
                  const range = quill.getSelection(true);
                  quill.insertEmbed(range.index, "image", res.url);
                }
              } catch (err) {
                console.error(err);
              }
            };
          },
        },
      },
    }),
    []
  );

  const handleInsertCode = () => {
    const quill = quillRef.current.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true) || { index: quill.getLength() };

    const content = `
<p><strong>HTML:</strong></p>
<pre><code class="language-html">${html}</code></pre>

<p><strong>CSS:</strong></p>
<pre><code class="language-css">${css}</code></pre>

<p><strong>JS:</strong></p>
<pre><code class="language-js">${js}</code></pre>
`;

    quill.clipboard.dangerouslyPasteHTML(range.index, content);
    setOpenRunCode(false);
  };

  return (
    <div className="border rounded-sm overflow-hidden">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="[&_.ql-editor]:min-h-[300px] [&_.ql-editor]:text-sm"
      />

      <CodeRunnerModal
        open={openRunCode}
        setOpen={setOpenRunCode}
        html={html}
        setHtml={setHtml}
        js={js}
        setJs={setJs}
        css={css}
        setCss={setCss}
        handleInsertCode={handleInsertCode}
      />
    </div>
  );
}

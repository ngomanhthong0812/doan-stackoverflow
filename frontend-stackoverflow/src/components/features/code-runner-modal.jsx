import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export default function CodeRunnerModal({
  open,
  setOpen,
  html,
  setHtml,
  css,
  setCss,
  js,
  setJs,
  handleInsertCode,
}) {
  const [srcDoc, setSrcDoc] = useState("");
  const [logs, setLogs] = useState([]);

  const runCode = () => {
    const source = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            // Gửi log ra parent
            (function() {
              const oldLog = console.log;
              console.log = function(...args) {
                oldLog.apply(this, args);
                window.parent.postMessage(
                  { type: "iframe-log", args },
                  "*"
                );
              };
            })();
            ${js}
          </script>
        </body>
      </html>
    `;
    setLogs([]); // clear log mỗi lần run
    setSrcDoc(source);
  };

  const resetCode = () => {
    setHtml("");
    setCss("");
    setJs("");
    setSrcDoc("");
    setLogs([]);
  };

  // Lắng nghe log từ iframe
  useEffect(() => {
    const handler = (event) => {
      if (event.data.type === "iframe-log") {
        setLogs((prev) => [...prev, event.data.args.join(" ")]);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="min-w-7xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            HTML / CSS / JS
          </DialogTitle>
        </DialogHeader>

        {/* Code editors */}
        <div className="grid grid-cols-3 gap-3 flex-1">
          <div className="flex flex-col border overflow-hidden">
            <div className="bg-gray-100 px-3 py-1 text-sm font-medium border-b">
              HTML
            </div>
            <Editor
              height="100%"
              defaultLanguage="html"
              value={html}
              onChange={(v) => setHtml(v ?? "")}
            />
          </div>

          <div className="flex flex-col border overflow-hidden">
            <div className="bg-gray-100 px-3 py-1 text-sm font-medium border-b">
              CSS
            </div>
            <Editor
              height="100%"
              defaultLanguage="css"
              value={css}
              onChange={(v) => setCss(v ?? "")}
            />
          </div>

          <div className="flex flex-col border overflow-hidden">
            <div className="bg-gray-100 px-3 py-1 text-sm font-medium border-b">
              JavaScript
            </div>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={js}
              onChange={(v) => setJs(v ?? "")}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-3">
          <Button
            onClick={runCode}
            className="bg-[#1b75d0] w-fit hover:!bg-[#155ca2] text-white flex items-center gap-2"
          >
            <Play size={16} />
            Run
          </Button>
          <Button
            onClick={handleInsertCode}
            className="bg-[#1b75d0] w-fit hover:!bg-[#155ca2] text-white"
          >
            Save & insert into post
          </Button>
          <Button
            onClick={resetCode}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>

        {/* Result Preview */}
        <div className="flex-1 mt-3 flex flex-col border overflow-hidden">
          <div className="bg-gray-100 px-3 py-1 text-sm font-medium border-b">
            Result Preview
          </div>
          <iframe
            srcDoc={srcDoc}
            title="preview"
            sandbox="allow-scripts allow-same-origin"
            frameBorder="0"
            width="100%"
            height="100%"
          />
        </div>

        {/* Console Logs */}
        <div className="mt-3 border bg-black text-white p-2 h-32 overflow-auto text-sm">
          <div className="text-gray-400 mb-1">Console</div>
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet...</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

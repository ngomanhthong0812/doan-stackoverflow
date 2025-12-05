import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/(app)/frontend-lag")({
  component: RouteComponent,
});

function RouteComponent() {
  // Default values similar to what was there or useful defaults
  const [html, setHtml] = useState("<h1>Hello World</h1>");
  const [css, setCss] = useState("h1 { color: red; }");
  const [js, setJs] = useState("console.log('Hi from JS')");
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
    setHtml("<h1>Hello World</h1>");
    setCss("h1 { color: red; }");
    setJs("console.log('Hi from JS')");
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
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Frontend Lag - Code Runner</h2>
        <div className="flex gap-3">
          <Button
            onClick={runCode}
            className="bg-[#1b75d0] w-fit hover:!bg-[#155ca2] text-white flex items-center gap-2"
          >
            <Play size={16} />
            Run
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
      </div>

      {/* Code editors */}
      <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
        <div className="flex flex-col border overflow-hidden h-full">
          <div className="bg-gray-100 px-3 py-1 text-sm font-medium border-bshrink-0">
            HTML
          </div>
          <div className="flex-1 overflow-hidden">
             <Editor
              height="100%"
              defaultLanguage="html"
              value={html}
              onChange={(v) => setHtml(v ?? "")}
            />
          </div>
        </div>

        <div className="flex flex-col border overflow-hidden h-full">
          <div className="bg-gray-100 px-3 py-1 text-sm font-medium border-b shrink-0">
            CSS
          </div>
           <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="css"
              value={css}
              onChange={(v) => setCss(v ?? "")}
            />
          </div>
        </div>

        <div className="flex flex-col border overflow-hidden h-full">
          <div className="bg-gray-100 px-3 py-1 text-sm font-medium border-b shrink-0">
            JavaScript
          </div>
           <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={js}
              onChange={(v) => setJs(v ?? "")}
            />
          </div>
        </div>
      </div>

      {/* Result Preview & Logs */}
      <div className="h-1/2 flex flex-col gap-3">
         <div className="flex-1 flex flex-col border overflow-hidden">
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
        <div className="border bg-black text-white p-2 h-32 overflow-auto text-sm shrink-0">
          <div className="text-gray-400 mb-1">Console</div>
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet...</div>
          ) : (
            logs.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
}

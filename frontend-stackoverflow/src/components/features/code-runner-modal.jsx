import React, { useState } from "react";
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

export default function CodeRunnerModal({ open, setOpen }) {
  const [html, setHtml] = useState("<h1>Hello World</h1>");
  const [css, setCss] = useState("h1 { color: red; }");
  const [js, setJs] = useState("console.log('JS chạy')");
  const [srcDoc, setSrcDoc] = useState("");

  const runCode = () => {
    const source = `
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
    setSrcDoc(source);
  };

  const resetCode = () => {
    setHtml("");
    setCss("");
    setJs("");
    setSrcDoc("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="min-w-7xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>HTML / CSS / JS</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 flex-1">
          <Editor
            height="100%"
            defaultLanguage="html"
            value={html}
            onChange={(v) => setHtml(v ?? "")}
          />
          <Editor
            height="100%"
            defaultLanguage="css"
            value={css}
            onChange={(v) => setCss(v ?? "")}
          />
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={js}
            onChange={(v) => setJs(v ?? "")}
          />
        </div>

        <div className="flex gap-2 mt-2">
          <Button
            onClick={runCode}
            className="bg-[#1b75d0] w-fit hover:!bg-[#155ca2] text-white"
          >
            <Play />
            Run
          </Button>
          <Button
            onClick={resetCode}
            variant="outline"
            className="flex items-center gap-1"
          >
            <RotateCcw size={16} />
            Reset
          </Button>
        </div>

        <div className="flex-1 mt-2 border rounded bg-white overflow-hidden">
          <iframe
            srcDoc={srcDoc}
            title="preview"
            sandbox="allow-scripts allow-same-origin"
            frameBorder="0"
            width="100%"
            height="100%"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

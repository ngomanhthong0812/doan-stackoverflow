export default function AskSidebar() {
  return (
    <div className="border border-[#1b75d0]/30 bg-[#1b75d0]/10 rounded-md py-3 px-4 max-w-[300px] ml-6 h-fit text-sm text-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Writing a good question
      </h2>

      <p className="mb-2">
        You’re ready to{" "}
        <a href="/questions/ask" className="text-blue-600 hover:underline">
          ask a programming-related question
        </a>{" "}
        and this form will help guide you through the process.
      </p>

      <p className="mb-3">
        Looking to ask a non-programming question? See{" "}
        <a href="#" className="text-blue-600 hover:underline">
          the topics here
        </a>{" "}
        to find a relevant site.
      </p>

      <h3 className="font-medium text-gray-900 mb-1">Steps</h3>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        <li>Summarize your problem in a one-line title.</li>
        <li>Describe your problem in more detail.</li>
        <li>Describe what you tried and what you expected to happen.</li>
        <li>
          Add <span className="italic">“tags”</span> to help surface your
          question to the community.
        </li>
        <li>Review your question and post it to the site.</li>
      </ul>
    </div>
  );
}

import { Pencil, Megaphone } from "lucide-react";

export default function QuestionSidebar() {
  return (
    <div className="border border-[#f4d27b] bg-[#fdf7e7] rounded-md py-3 max-w-[300px] ml-6 h-fit">
      {/* The Overflow Blog */}
      <h3 className="font-bold text-gray-800 px-3 mb-2 text-sm">
        The Overflow Blog
      </h3>
      <ul className="space-y-2 mb-3 px-3 text-[13px]">
        <li className="flex items-start gap-2">
          <Pencil size={16} className="text-gray-500 mt-0.5" />
          <span>Open-source is for the people, by the people</span>
        </li>
        <li className="flex items-start gap-2">
          <Pencil size={16} className="text-gray-500 mt-0.5" />
          <span>
            Moving the public Stack Overflow sites to the cloud: Part 1
          </span>
        </li>
      </ul>

      <p className="bg-[#f4d27b] h-[1px] my-4"></p>

      {/* Featured on Meta */}
      <h3 className="font-bold text-gray-800 px-3 mb-2 text-sm">
        Featured on Meta
      </h3>
      <ul className="space-y-2 px-3 text-[13px]">
        <li className="flex items-start gap-2">
          <Megaphone size={16} className="text-gray-500 mt-0.5" />
          <span>New comment UI experiment graduation</span>
        </li>
        <li className="flex items-start gap-2">
          <Megaphone size={16} className="text-gray-500 mt-0.5" />
          <span>Policy: Generative AI (e.g., ChatGPT) is banned</span>
        </li>
      </ul>
    </div>
  );
}

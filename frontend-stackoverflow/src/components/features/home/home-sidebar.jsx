import { Megaphone, Flame } from "lucide-react";

export default function HomeSidebar() {
  return (
    <div className="border bg-white rounded-md py-3 max-w-[300px] ml-6 h-fit">
      {/* Featured on Meta */}
      <h3 className="font-bold text-gray-800 px-3 mb-2 text-sm">
        Featured on Meta
      </h3>
      <ul className="space-y-2 mb-3 px-3 text-[13px]">
        <li className="flex items-start gap-2">
          <Megaphone size={16} className="text-gray-500 mt-0.5" />
          <span>Community Asks Sprint Announcement - September 2025</span>
        </li>
        <li className="flex items-start gap-2">
          <Megaphone size={16} className="text-gray-500 mt-0.5" />
          <span>CodeBuddy.ai - rebuilt for attribution</span>
        </li>
        <li className="flex items-start gap-2">
          <Megaphone size={16} className="text-gray-500 mt-0.5" />
          <span>Policy: Generative AI (e.g., ChatGPT) is banned</span>
        </li>
        <li className="flex items-start gap-2">
          <Megaphone size={16} className="text-gray-500 mt-0.5" />
          <span>New comment UI experiment graduation</span>
        </li>
      </ul>

      <p className="border-t my-4"></p>

      {/* Hot Meta Posts */}
      <h3 className="font-bold text-gray-800 px-3 mb-2 text-sm">
        Hot Meta Posts
      </h3>
      <ul className="space-y-2 px-3 text-[13px]">
        <li className="flex items-start gap-2">
          <Flame size={16} className="text-gray-500 mt-0.5" />
          <span>What exactly is needed for a basic how-to question?</span>
        </li>
        <li className="flex items-start gap-2">
          <Flame size={16} className="text-gray-500 mt-0.5" />
          <span>This [region] should be closed off</span>
        </li>
      </ul>
    </div>
  );
}

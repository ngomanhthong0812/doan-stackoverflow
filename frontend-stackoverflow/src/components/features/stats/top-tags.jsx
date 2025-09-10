import { Tag } from "lucide-react";

export default function TopTags({ topTags }) {
  return (
    <div className="p-4 border rounded-md bg-white shadow">
      <h2 className="font-semibold mb-3 flex items-center gap-2">
        <Tag className="w-5 h-5 text-purple-500" /> Top Tags
      </h2>
      <ul className="space-y-1">
        {topTags.map((tag) => (
          <li key={tag.name} className="flex justify-between">
            <span className="text-gray-700">{tag.name}</span>
            <span className="text-gray-500">{tag.count} uses</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { Users, ClipboardList } from "lucide-react";

export default function OverviewCards({ totalUsers, totalQuestions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-3 p-4 border rounded-md bg-white shadow">
        <Users className="w-6 h-6 text-blue-500" />
        <div>
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-lg font-semibold">{totalUsers}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 border rounded-md bg-white shadow">
        <ClipboardList className="w-6 h-6 text-green-500" />
        <div>
          <div className="text-sm text-gray-500">Questions Posted</div>
          <div className="text-lg font-semibold">{totalQuestions}</div>
        </div>
      </div>
    </div>
  );
}

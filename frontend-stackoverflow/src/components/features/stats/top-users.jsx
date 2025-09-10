import { Award } from "lucide-react";

export default function TopUsers({ topUsers }) {
  return (
    <div className="p-4 border rounded-md bg-white shadow">
      <h2 className="font-semibold mb-3 flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-500" /> Top Contributors
      </h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-1">Username</th>
            <th>Reputation</th>
            <th>Answers Count</th>
          </tr>
        </thead>
        <tbody>
          {topUsers.map((u) => (
            <tr key={u.username} className="border-b hover:bg-gray-50">
              <td className="py-1">{u.username}</td>
              <td>{u.reputation}</td>
              <td>{u.answersCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

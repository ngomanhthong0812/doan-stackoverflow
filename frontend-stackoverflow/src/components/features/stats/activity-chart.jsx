import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ActivityChart({
  chartData,
  period,
  setPeriod,
  chartRef,
}) {
  return (
    <div ref={chartRef} className="p-4 border rounded-md bg-white shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">Activity Over Time</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border px-2 py-1 rounded-md text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#1f77b4" name="Users" />
          <Line
            type="monotone"
            dataKey="questions"
            stroke="#ff7f0e"
            name="Questions"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

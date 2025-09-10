import { useState, useMemo, useRef, useEffect } from "react";
import OverviewCards from "./overview-cards";
import TopTags from "./top-tags";
import TopUsers from "./top-users";
import ActivityChart from "./activity-chart";
import ExportButtons from "./export-buttons";
import { _getStats } from "@/services/stats";

export default function Stats() {
  const [period, setPeriod] = useState("week");
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await _getStats();
        setStatsData(res);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Dữ liệu chart
  const chartData = useMemo(
    () => (statsData ? statsData.activityData[period] : []),
    [statsData, period]
  );

  if (loading || !statsData) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 animate-pulse">
          Loading statistics...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 space-y-6">
      <h1 className="!text-4xl font-bold mb-4">Site Statistics</h1>

      {/* Export Buttons */}
      <ExportButtons
        statsData={statsData}
        chartData={chartData}
        period={period}
        chartRef={chartRef}
      />

      {/* Tổng quan */}
      <OverviewCards
        totalUsers={statsData.totalUsers}
        totalQuestions={statsData.totalQuestions}
      />

      {/* Top Tags */}
      <TopTags topTags={statsData.topTags} />

      {/* Top Users */}
      <TopUsers topUsers={statsData.topUsers} />

      {/* Activity Chart */}
      <ActivityChart
        chartData={chartData}
        period={period}
        setPeriod={setPeriod}
        chartRef={chartRef}
      />
    </div>
  );
}

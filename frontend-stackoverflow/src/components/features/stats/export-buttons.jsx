import html2canvas from "html2canvas-pro"; // đổi sang html2canvas-pro
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportButtons({
  statsData,
  chartData,
  period,
  chartRef,
}) {

  // In chart bằng html2canvas-pro + jsPDF
  const handlePrintChart = async () => {
    if (!chartRef.current) {
      console.error("Chart element not found");
      return;
    }
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2,
        backgroundColor: "#ffffff", // tránh trong suốt
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      pdf.save("chart-report.pdf");
    } catch (err) {
      console.error("Error generating chart PDF:", err);
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    const allData = [
      ["Metric", "Value"],
      ["Active Users", statsData.totalUsers],
      ["Questions Posted", statsData.totalQuestions],
      [],
      ["Top Tags", "Uses"],
      ...statsData.topTags.map((t) => [t.name, t.count]),
      [],
      ["Top Users", "Reputation", "Accepted Answers"],
      ...statsData.topUsers.map((u) => [
        u.username,
        u.reputation,
        u.acceptedAnswers,
      ]),
      [],
      [`Activity (${period})`, "Users", "Questions"],
      ...chartData.map((d) => [d.day, d.users, d.questions]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stats");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "stats-report.xlsx"
    );
  };

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={handlePrintChart}
        className="px-3 py-1 bg-purple-500 text-white rounded-md"
      >
        Export Chart PDF
      </button>
      <button
        onClick={handleExportExcel}
        className="px-3 py-1 bg-green-500 text-white rounded-md"
      >
        Export Excel
      </button>
    </div>
  );
}

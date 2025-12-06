import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  RefreshCw,
  ChevronRight,
  CheckCircle,
  FastForward,
  Upload,
} from "lucide-react";

export default function MergeSortVisualizer() {
  // --- State ---
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10]); // Mảng ví dụ cho Merge Sort
  const [isSorting, setIsSorting] = useState(false);
  const [isFinished, setIsFinished] = useState(false); // State cho nhập liệu thủ công
  const [customInput, setCustomInput] = useState(""); // Các biến state để highlight màu sắc
  const [activeRangeIndices, setActiveRangeIndices] = useState([]); // Phạm vi mảng đang được hợp nhất (Màu xanh lam nhạt)
  const [comparingIndices, setComparingIndices] = useState([]); // Các phần tử đang so sánh trong lúc hợp nhất (Màu vàng)
  const [sortedIndices, setSortedIndices] = useState([]); // Đã sắp xếp xong toàn bộ (Màu xanh lá)
  const [speed, setSpeed] = useState(600); // Tốc độ animation (ms)
  const [logs, setLogs] = useState([]); // Nhật ký hoạt động
  const sortingRef = useRef(false); // Ref để dừng thuật toán khẩn cấp
  // --- Constants for UI ---
  const MAX_ARRAY_SIZE = 20; // --- Helpers ---

  const generateRandomArray = (size = 8) => {
    const newArr = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 90) + 10
    );
    resetState(newArr);
    setCustomInput("");
  };

  const loadExampleArray = () => {
    resetState([38, 27, 43, 3, 9, 82, 10]);
    setCustomInput("");
  };

  const handleCustomInputSubmit = () => {
    if (!customInput.trim()) return;
    const nums = customInput
      .split(/[\s,]+/)
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n));

    if (nums.length === 0) {
      console.error("Vui lòng nhập ít nhất một số hợp lệ.");
      return;
    }

    if (nums.length > MAX_ARRAY_SIZE) {
      console.warn(
        `Để hiển thị tốt nhất, hệ thống sẽ lấy ${MAX_ARRAY_SIZE} số đầu tiên.`
      );
      resetState(nums.slice(0, MAX_ARRAY_SIZE));
    } else {
      resetState(nums);
    }
  };

  const resetState = (newArr) => {
    sortingRef.current = false;
    setArray(newArr);
    setActiveRangeIndices([]);
    setComparingIndices([]);
    setSortedIndices([]);
    setIsSorting(false);
    setIsFinished(false);
    setLogs([
      { text: 'Sẵn sàng. Nhấn "Bắt đầu sắp xếp" để chạy Merge Sort.', id: 0 },
    ]);
  };
  useEffect(() => {
    loadExampleArray(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const addLog = (text) => {
    setLogs((prev) => [...prev, { text, id: Date.now() + Math.random() }]);
    setTimeout(() => {
      const logContainer = document.getElementById("log-container");
      if (logContainer) logContainer.scrollTop = logContainer.scrollHeight;
    }, 50);
  }; // --- CORE ALGORITHM: MERGE SORT (Recursive Divide & Merge) ---
  // Hàm hợp nhất (Merge)

  const merge = async (arr, start, mid, end) => {
    if (!sortingRef.current) return;
    setActiveRangeIndices([start, end]); // Highlight phạm vi đang hợp nhất
    addLog(
      `--- Hợp nhất [${start}-${end}]. Phạm vi: [${arr.slice(start, end + 1).join(", ")}]`
    );
    await sleep(speed * 0.5);

    let n1 = mid - start + 1;
    let n2 = end - mid;

    let L = new Array(n1);
    let R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[start + i];
    for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    let i = 0,
      j = 0,
      k = start;

    while (i < n1 && j < n2) {
      if (!sortingRef.current) return; // Highlight các phần tử đang so sánh (phần tử từ mảng trái và mảng phải)

      setComparingIndices([start + i, mid + 1 + j]);
      await sleep(speed);

      if (L[i] <= R[j]) {
        addLog(` -> Đặt ${L[i]} vào vị trí ${k}.`);
        arr[k] = L[i];
        i++;
      } else {
        addLog(` -> Đặt ${R[j]} vào vị trí ${k}.`);
        arr[k] = R[j];
        j++;
      } // Cập nhật mảng UI sau mỗi lần đặt
      setArray([...arr]);
      setComparingIndices([]);
      await sleep(speed * 0.2);
      k++;
    } // Xử lý các phần tử còn lại

    while (i < n1) {
      if (!sortingRef.current) return;
      setComparingIndices([start + i]); // Đặt phần tử còn lại
      addLog(` -> Đặt phần tử còn lại ${L[i]} vào vị trí ${k}.`);
      arr[k] = L[i];
      setArray([...arr]);
      await sleep(speed * 0.2);
      setComparingIndices([]);
      i++;
      k++;
    }

    while (j < n2) {
      if (!sortingRef.current) return;
      setComparingIndices([mid + 1 + j]); // Đặt phần tử còn lại
      addLog(` -> Đặt phần tử còn lại ${R[j]} vào vị trí ${k}.`);
      arr[k] = R[j];
      setArray([...arr]);
      await sleep(speed * 0.2);
      setComparingIndices([]);
      j++;
      k++;
    } // Clear active range after merge
    setActiveRangeIndices([]);
  }; // Hàm chia (Divide)

  const mergeSort = async (arr, start, end) => {
    if (!sortingRef.current) return;
    if (start >= end) {
      if (start === end) {
        addLog(
          `Đệ quy: Phần tử đơn lẻ [${start}] = ${arr[start]}. Coi như đã sắp xếp.`
        );
      }
      return; // Base case
    }
    const mid = Math.floor((start + end) / 2);
    addLog(
      `--- Chia [${start}-${end}] thành [${start}-${mid}] và [${mid + 1}-${end}]`
    );
    await sleep(speed * 0.1); // Đệ quy cho nửa trái

    await mergeSort(arr, start, mid); // Đệ quy cho nửa phải
    await mergeSort(arr, mid + 1, end); // Hợp nhất hai nửa đã sắp xếp

    await merge(arr, start, mid, end);
  };

  const runMergeSort = async () => {
    if (isSorting) return;
    if (isFinished) {
      resetState([...array]);
      await sleep(100);
    }
    setIsSorting(true);
    setIsFinished(false);
    sortingRef.current = true;
    let arr = [...array];
    addLog(`Bắt đầu Merge Sort với mảng: [${arr.join(", ")}]`);

    await mergeSort(arr, 0, arr.length - 1); // Kết thúc

    if (sortingRef.current) {
      // Đảm bảo tất cả đều xanh
      const allIndices = Array.from({ length: arr.length }, (_, i) => i);
      setSortedIndices(allIndices);
      setIsSorting(false);
      setIsFinished(true);
      addLog("HOÀN THÀNH SẮP XẾP!");
      sortingRef.current = false;
    } else {
      // Nếu bị dừng thủ công
      setIsSorting(false);
      addLog("ĐÃ DỪNG THUẬT TOÁN BỞI NGƯỜI DÙNG.");
    }
  }; // --- RENDER UI ---

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800 ">
      {/* HEADER */}{" "}
      <div className="bg-white p-4 shadow-sm border-b flex flex-col gap-3 z-10">
        {" "}
        <div className="flex justify-between items-center">
          {" "}
          <div>
            {" "}
            <h1 className="font-bold text-xl text-indigo-600 flex items-center gap-2">
              {" "}
              <div className="w-2 h-6 bg-indigo-500 rounded-sm"></div>
              Mô phỏng **Merge Sort**{" "}
            </h1>{" "}
            <p className="text-xs text-slate-500 mt-1">
              Trực quan hóa giải thuật **Chia để trị** (Divide and Conquer)
            </p>{" "}
          </div>
          {/* Bộ điều chỉnh tốc độ */}{" "}
          <div className="flex flex-col items-end mx-2 min-w-[100px]">
            {" "}
            <span className="text-[10px] uppercase text-slate-400 font-bold mb-1 flex items-center gap-1">
              <FastForward size={10} /> Tốc độ ({speed}ms){" "}
            </span>{" "}
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={1550 - speed} // Đảo ngược để kéo phải nhanh hơn
              onChange={(e) => setSpeed(1550 - Number(e.target.value))}
              className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />{" "}
          </div>{" "}
        </div>
        {/* CONTROLS ROW */}{" "}
        <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-2 rounded-lg border border-slate-100">
          {/* INPUT CUSTOM ARRAY */}{" "}
          <div className="flex items-center gap-1 mr-2 bg-white p-1 rounded border border-slate-200 focus-within:ring-2 ring-indigo-200 transition-all">
            {" "}
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Nhập mảng: 5, 12, 1, 8..."
              className="text-sm outline-none px-2 w-48 text-slate-700 placeholder:text-slate-400"
              disabled={isSorting}
              onKeyDown={(e) => e.key === "Enter" && handleCustomInputSubmit()}
            />{" "}
            <button
              onClick={handleCustomInputSubmit}
              disabled={isSorting || !customInput.trim()}
              className="p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded transition-colors text-xs font-bold flex items-center gap-1 disabled:opacity-50"
            >
              <Upload size={12} /> Nạp{" "}
            </button>{" "}
          </div>{" "}
          <div className="w-[1px] h-6 bg-slate-300 mx-1 hidden md:block"></div>{" "}
          <button
            onClick={loadExampleArray}
            disabled={isSorting}
            className="px-3 py-1.5 text-xs md:text-sm bg-white border hover:bg-slate-50 rounded text-slate-600 font-medium disabled:opacity-50 transition-colors"
          >
            Ví dụ{" "}
          </button>{" "}
          <button
            onClick={() => generateRandomArray(8)}
            disabled={isSorting}
            className="px-3 py-1.5 text-xs md:text-sm bg-white border hover:bg-slate-50 rounded text-slate-600 font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            <RefreshCw size={12} /> Random{" "}
          </button>
          <div className="flex-1"></div>{" "}
          <button
            onClick={runMergeSort}
            disabled={isSorting && !isFinished}
            className={`px-4 py-1.5 rounded shadow-sm text-white font-bold text-sm flex items-center gap-2 transition-all ${
              isFinished
                ? "bg-green-600 hover:bg-green-700"
                : isSorting
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {" "}
            {isSorting && !isFinished
              ? "Đang chạy..."
              : isFinished
                ? "Chạy lại"
                : "Bắt đầu sắp xếp"}{" "}
            {!isSorting && !isFinished && (
              <Play size={14} fill="currentColor" />
            )}
            {isFinished && <RefreshCw size={14} />}{" "}
          </button>{" "}
          <button
            onClick={() => resetState(array)}
            disabled={!isSorting && !isFinished} // Chỉ cho phép reset khi đang chạy hoặc đã xong
            className="p-1.5 text-slate-500 hover:text-red-500 border rounded hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Dừng & Đặt lại"
          >
            <RotateCcw size={16} />{" "}
          </button>{" "}
        </div>{" "}
      </div>
      {/* BODY */}{" "}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* VISUALIZATION AREA */}{" "}
        <div className="flex-1 bg-slate-100 relative flex items-center justify-center p-4 md:p-10 border-r border-slate-200 overflow-x-auto">
          {/* Legend / Chú thích màu */}{" "}
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-2 rounded-lg border shadow-lg text-xs space-y-2 z-10 pointer-events-none">
            {" "}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div> Bình
              thường
            </div>{" "}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-200 rounded-full"></div> Phạm vi
              đang Hợp nhất
            </div>{" "}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div> Đang So
              sánh (Merge)
            </div>{" "}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div> Hoàn
              thành Sắp xếp
            </div>{" "}
          </div>
          {/* CHART */}{" "}
          <div className="flex items-end gap-2 md:gap-3 h-64 md:h-80 w-full justify-center px-4">
            {" "}
            {array.map((value, idx) => {
              let bgColor = "bg-indigo-500"; // Mặc định
              let scale = "scale-100"; // Check xem index có nằm trong phạm vi đang hợp nhất không
              const isInActiveRange =
                activeRangeIndices.length === 2 &&
                idx >= activeRangeIndices[0] &&
                idx <= activeRangeIndices[1];

              if (sortedIndices.includes(idx)) {
                bgColor = "bg-green-500 shadow-lg shadow-green-300/50";
              } else if (comparingIndices.includes(idx)) {
                bgColor = "bg-yellow-400 shadow-md shadow-yellow-300/50";
                scale = "scale-110"; // Phóng to nhẹ khi so sánh
              } else if (isInActiveRange) {
                bgColor = "bg-blue-300 shadow-md shadow-blue-200/50"; // Phạm vi đang hợp nhất
              } // Tính chiều cao
              const maxVal = Math.max(...array, 10);
              const heightPercent = Math.max((value / maxVal) * 90, 5); // Tối thiểu 5%

              return (
                <div
                  key={idx}
                  className={`flex flex-col justify-end items-center transition-all duration-300 w-8 md:w-14 ${scale}`}
                >
                  {" "}
                  <span
                    className={`font-bold text-slate-700 mb-1 text-xs md:text-sm transition-colors duration-200 ${
                      sortedIndices.includes(idx)
                        ? "text-green-700"
                        : comparingIndices.includes(idx)
                          ? "text-yellow-700"
                          : isInActiveRange
                            ? "text-blue-700"
                            : "text-slate-700"
                    }`}
                  >
                    {value}
                  </span>{" "}
                  <div
                    className={`w-full rounded-t md:rounded-t-lg transition-colors duration-200 ${bgColor}`}
                    style={{ height: `${heightPercent}%`, minHeight: "20px" }}
                  ></div>{" "}
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">
                    [{idx}]
                  </span>{" "}
                </div>
              );
            })}{" "}
          </div>{" "}
        </div>
        {/* SIDEBAR: LOGS */}{" "}
        <div className="h-1/3 md:h-full w-full md:w-80 bg-white flex flex-col shadow-xl z-20">
          {/* Logs Header */}{" "}
          <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
            {" "}
            <h3 className="text-sm font-bold text-indigo-900 uppercase flex items-center gap-1">
              <ChevronRight size={14} className="text-indigo-600" /> Nhật ký
              hoạt động
            </h3>{" "}
            <span className="text-xs text-slate-500">
              {logs.length} sự kiện
            </span>{" "}
          </div>
          {/* Logs List */}{" "}
          <div
            id="log-container"
            className="flex-1 overflow-y-auto p-2 space-y-1 bg-white font-mono"
          >
            {" "}
            {logs.length === 0 && (
              <p className="text-center text-slate-300 text-xs italic mt-4">
                Chưa có dữ liệu...
              </p>
            )}{" "}
            {logs.map((log, index) => (
              <div
                key={log.id || index}
                className="text-xs p-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 animate-in slide-in-from-left-2 fade-in duration-300"
              >
                {" "}
                <span className="text-slate-400 mr-2">#{index + 1}</span>{" "}
                <span
                  className={
                    log.text.includes("Hợp nhất") || log.text.includes("Chia")
                      ? "text-indigo-600 font-bold"
                      : log.text.includes("Đã dừng")
                        ? "text-red-800 font-bold"
                        : log.text.includes("ĐẶT")
                          ? "text-blue-700"
                          : log.text.includes("HOÀN THÀNH")
                            ? "text-green-600 font-bold"
                            : "text-slate-700"
                  }
                >
                  {log.text}{" "}
                </span>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCcw,
  RefreshCw,
  ChevronRight,
  CheckCircle,
  Settings,
  FastForward,
  Upload,
} from "lucide-react";

export default function BubbleSortVisualizer() {
  // --- State ---
  const [array, setArray] = useState([5, 3, 8, 6, 2]); // Mảng mặc định theo ví dụ
  const [isSorting, setIsSorting] = useState(false);
  const [isFinished, setIsFinished] = useState(false); // State cho nhập liệu thủ công
  const [customInput, setCustomInput] = useState(""); // Các biến state để highlight màu sắc
  const [comparingIndices, setComparingIndices] = useState([]); // Đang so sánh (Màu vàng)
  const [swappingIndices, setSwappingIndices] = useState([]); // Đang hoán đổi (Màu đỏ)
  const [sortedIndices, setSortedIndices] = useState([]); // Đã sắp xếp xong (Màu xanh)
  const [speed, setSpeed] = useState(800); // Tốc độ animation (ms)
  const [logs, setLogs] = useState([]); // Nhật ký hoạt động
  const sortingRef = useRef(false); // Ref để dừng thuật toán khẩn cấp
  // --- Helpers ---
  const generateRandomArray = (size = 8) => {
    const newArr = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 50) + 5
    );
    resetState(newArr);
    setCustomInput(""); // Xóa input khi random
  };

  const loadExampleArray = () => {
    resetState([5, 3, 8, 6, 2]);
    setCustomInput("");
  };

  const handleCustomInputSubmit = () => {
    if (!customInput.trim()) return; // Tách chuỗi bằng dấu phẩy hoặc khoảng trắng, lọc ra số
    const nums = customInput
      .split(/[\s,]+/)
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n));

    if (nums.length === 0) {
      // Thay thế alert bằng UI thông báo
      console.error("Vui lòng nhập ít nhất một số hợp lệ.");
      return;
    }

    if (nums.length > 20) {
      // Thay thế alert bằng UI thông báo
      console.warn("Để hiển thị tốt nhất, hệ thống sẽ lấy 20 số đầu tiên.");
      resetState(nums.slice(0, 20));
    } else {
      resetState(nums);
    }
  }; // Xử lý lỗi: Cần đảm bảo `alert` không được dùng. Đã thay thế bằng `console.error`/`console.warn`
  // Tuy nhiên, nếu muốn hiển thị cho người dùng, cần dùng một modal/toast component.
  const resetState = (newArr) => {
    sortingRef.current = false; // Dừng loop nếu đang chạy
    setArray(newArr);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    setIsSorting(false);
    setIsFinished(false);
    setLogs([{ text: 'Sẵn sàng. Nhấn "Bắt đầu sắp xếp" để chạy.', id: 0 }]);
  };
  useEffect(() => {
    // Khởi tạo mảng ví dụ khi component mount lần đầu
    loadExampleArray();
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const addLog = (text) => {
    setLogs((prev) => [...prev, { text, id: Date.now() + Math.random() }]); // Auto scroll
    setTimeout(() => {
      const logContainer = document.getElementById("log-container");
      if (logContainer) logContainer.scrollTop = logContainer.scrollHeight;
    }, 50);
  }; // --- CORE ALGORITHM: BUBBLE SORT ---

  const runBubbleSort = async () => {
    if (isSorting) return; // Đặt lại trạng thái nếu đã hoàn thành
    if (isFinished) {
      resetState([...array]); // Chờ reset hoàn tất trước khi chạy
      await sleep(100);
    }
    setIsSorting(true);
    setIsFinished(false);
    sortingRef.current = true; // Copy mảng hiện tại để thao tác
    let arr = [...array];
    let n = arr.length;
    let sortedIdxs = [];

    addLog(`Bắt đầu Bubble Sort với mảng: [${arr.join(", ")}]`); // Vòng lặp i (số phần tử đã nổi lên cuối)

    for (let i = 0; i < n; i++) {
      if (!sortingRef.current) break; // Check dừng
      let swapped = false; // Vòng lặp j (duyệt từ đầu đến n-i-1)

      for (let j = 0; j < n - i - 1; j++) {
        if (!sortingRef.current) break; // Check dừng
        // 1. Highlight cặp đang so sánh (Vàng)

        setComparingIndices([j, j + 1]);
        addLog(`So sánh ${arr[j]} và ${arr[j + 1]}...`);
        await sleep(speed); // Cần check dừng một lần nữa sau sleep

        if (!sortingRef.current) break; // 2. Kiểm tra điều kiện
        if (arr[j] > arr[j + 1]) {
          // Highlight cặp sắp đổi chỗ (Đỏ)
          setSwappingIndices([j, j + 1]);
          addLog(`-> ${arr[j]} > ${arr[j + 1]}: HOÁN ĐỔI!`); // Hoán đổi trong mảng tạm
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true; // Cập nhật UI

          setArray([...arr]);
          await sleep(speed); // Tắt highlight đỏ
          setSwappingIndices([]);
        } else {
          addLog(`-> ${arr[j]} <= ${arr[j + 1]}: Giữ nguyên.`);
        } // Tắt highlight vàng

        setComparingIndices([]);
      }
      if (!sortingRef.current) break; // Check dừng sau vòng lặp j
      // Phần tử ở vị trí n-i-1 đã về đúng chỗ (lớn nhất trong phần chưa sắp xếp)
      // Highlight Xanh

      sortedIdxs.push(n - i - 1);
      setSortedIndices([...sortedIdxs]);
      addLog(`Phần tử ${arr[n - i - 1]} đã "nổi" về đúng vị trí cuối.`);
      await sleep(speed / 2); // Tối ưu: Nếu không có hoán đổi nào trong vòng lặp j, mảng đã sắp xếp xong

      if (!swapped) {
        addLog(
          "Không có hoán đổi nào xảy ra -> Mảng đã được sắp xếp xong sớm."
        ); // Mark tất cả còn lại là sorted
        const remaining = [];
        for (let k = 0; k < n - i - 1; k++) remaining.push(k);
        setSortedIndices((prev) => [...prev, ...remaining]);
        break;
      }
    } // Kết thúc

    if (sortingRef.current) {
      // Đảm bảo tất cả đều xanh (trường hợp chạy hết vòng lặp hoặc tối ưu sớm)
      const allIndices = Array.from({ length: n }, (_, i) => i);
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
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800">
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
              Mô phỏng Bubble Sort{" "}
            </h1>{" "}
            <p className="text-xs text-slate-500 mt-1">
              Trực quan hóa thuật toán sắp xếp nổi bọt
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
            onClick={runBubbleSort}
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
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div> Đang so
              sánh
            </div>{" "}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div> Đang hoán
              đổi ({">"} sau)
            </div>{" "}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div> Đã vào
              vị trí đúng
            </div>{" "}
          </div>
          {/* CHART */}{" "}
          <div className="flex items-end gap-2 md:gap-3 h-64 md:h-80 w-full justify-center px-4">
            {" "}
            {array.map((value, idx) => {
              let bgColor = "bg-indigo-500"; // Mặc định
              let scale = "scale-100";
              if (sortedIndices.includes(idx)) {
                bgColor = "bg-green-500 shadow-lg shadow-green-300/50";
              } else if (swappingIndices.includes(idx)) {
                bgColor = "bg-red-500 shadow-lg shadow-red-300/50";
                scale = "scale-110"; // Phóng to nhẹ khi swap
              } else if (comparingIndices.includes(idx)) {
                bgColor = "bg-yellow-400 shadow-md shadow-yellow-300/50";
              } // Tính chiều cao (max 100% container, giả sử max value input khoảng 100)
              // Chuẩn hóa chiều cao: lấy max trong mảng hiện tại để tính %

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
                        : swappingIndices.includes(idx)
                          ? "text-red-700"
                          : comparingIndices.includes(idx)
                            ? "text-yellow-700"
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
        {/* SIDEBAR: INFO & LOGS */}{" "}
        <div className="h-1/3 md:h-full w-full md:w-80 bg-white flex flex-col shadow-xl z-20">
          {" "}
          {/* Logs Header - Đã loại bỏ phần Logic Thuật toán và thay thế bằng tiêu đề này */}{" "}
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
                    log.text.includes("HOÁN ĐỔI")
                      ? "text-red-600 font-bold"
                      : log.text.includes("đúng vị trí") ||
                          log.text.includes("HOÀN THÀNH")
                        ? "text-green-600 font-bold"
                        : log.text.includes("DỪNG THUẬT TOÁN")
                          ? "text-red-800 font-bold"
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

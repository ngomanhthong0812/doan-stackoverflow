import React, { useState } from "react";
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Link as LinkIcon,
  MapPin,
  CheckCircle,
  ArrowRight,
  Settings,
  ToggleLeft,
  ToggleRight,
  GitCommit,
  CornerDownRight,
} from "lucide-react";

// --- Hằng số ---
const NODE_RADIUS = 20;
const ANIMATION_SPEED_MS = 800;

// --- Helper ---
const generateId = () => Math.random().toString(36).substr(2, 4).toUpperCase();

export default function UniversalPathfinder() {
  // --- Data ---
  const [nodes, setNodes] = useState([
    { id: "A", x: 250, y: 50 },
    { id: "B", x: 150, y: 150 },
    { id: "C", x: 350, y: 150 },
    { id: "D", x: 100, y: 280 },
    { id: "E", x: 200, y: 280 },
    { id: "F", x: 400, y: 280 },
  ]);

  const [edges, setEdges] = useState([
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 2 },
    { source: "B", target: "D", weight: 5 },
    { source: "B", target: "E", weight: 10 },
    { source: "C", target: "F", weight: 3 },
    { source: "E", target: "F", weight: 1 },
  ]);

  // --- Settings Switches ---
  const [isWeighted, setIsWeighted] = useState(true); // Có trọng số hay không
  const [isDirected, setIsDirected] = useState(true); // Có hướng hay không

  // --- Interaction State ---
  const [mode, setMode] = useState("select_points");
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [inputWeight, setInputWeight] = useState(5);

  // --- Algo State ---
  const [isRunning, setIsRunning] = useState(false);
  const [visited, setVisited] = useState([]);
  const [queue, setQueue] = useState([]); // Visual Queue (List or Priority Queue)
  const [currentNode, setCurrentNode] = useState(null);
  const [logs, setLogs] = useState([]);
  const [finalPath, setFinalPath] = useState([]);
  const [resultCost, setResultCost] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // ==========================================
  // MAIN LOGIC: SWITCH BETWEEN BFS & DIJKSTRA
  // ==========================================
  const runAlgorithm = async () => {
    if (!startNode || !endNode) {
      alert("Vui lòng chọn Điểm Đầu (Xanh) và Điểm Cuối (Đỏ) trước!");
      return;
    }
    if (isRunning) return;

    setIsRunning(true);
    setShowResult(false);
    setVisited([]);
    setQueue([]);
    setFinalPath([]);

    // Xây dựng Adjacency List dựa trên Setting "Có hướng/Vô hướng"
    const adj = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach((e) => {
      // Luôn thêm chiều thuận
      adj[e.source].push({ target: e.target, weight: e.weight });
      // Nếu VÔ HƯỚNG, thêm chiều ngược lại
      if (!isDirected) {
        adj[e.target].push({ target: e.source, weight: e.weight });
      }
    });

    // Quyết định thuật toán dựa trên "Có trọng số"
    if (isWeighted) {
      setLogs([
        {
          step: 0,
          text: `Chạy DIJKSTRA (${isDirected ? "Có hướng" : "Vô hướng"})`,
        },
      ]);
      await runDijkstraLogic(adj);
    } else {
      setLogs([
        { step: 0, text: `Chạy BFS (${isDirected ? "Có hướng" : "Vô hướng"})` },
      ]);
      await runBFSLogic(adj);
    }

    setIsRunning(false);
    setCurrentNode(null);
  };

  // --- 1. BFS LOGIC (Unweighted) ---
  const runBFSLogic = async (adj) => {
    // Sort alpha for stable visual
    Object.keys(adj).forEach((key) =>
      adj[key].sort((a, b) => a.target.localeCompare(b.target))
    );

    const queueTracker = [startNode];
    const visitedSet = new Set([startNode]);
    const parentMap = {};

    setQueue([...queueTracker]);
    setVisited(Array.from(visitedSet));
    addLog(`[BFS] Bắt đầu từ ${startNode}.`);

    let found = false;

    while (queueTracker.length > 0) {
      await sleep(ANIMATION_SPEED_MS);
      const u = queueTracker.shift();
      setCurrentNode(u);
      setQueue([...queueTracker]);
      addLog(`Xét đỉnh ${u}.`);

      if (u === endNode) {
        found = true;
        break;
      }

      // Duyệt neighbors
      const neighbors = adj[u] || [];
      for (const neighbor of neighbors) {
        const v = neighbor.target;
        if (!visitedSet.has(v)) {
          visitedSet.add(v);
          parentMap[v] = u;
          queueTracker.push(v);

          setVisited(Array.from(visitedSet));
          setQueue([...queueTracker]);
          addLog(`  -> Thêm ${v} vào hàng đợi.`);
        }
      }
    }

    if (found) {
      reconstructPath(parentMap);
      // BFS cost = số cạnh (số bước nhảy)
      setResultCost("N/A (Unweighted)");
    } else {
      addLog("Không tìm thấy đường đi.");
    }
  };

  // --- 2. DIJKSTRA LOGIC (Weighted) ---
  const runDijkstraLogic = async (adj) => {
    // Sort by weight
    Object.keys(adj).forEach((key) =>
      adj[key].sort((a, b) => a.weight - b.weight)
    );

    const distances = {};
    const previous = {};
    const pq = []; // [{id, dist}]

    nodes.forEach((n) => (distances[n.id] = Infinity));
    distances[startNode] = 0;
    pq.push({ id: startNode, dist: 0 });

    const visitedList = [];
    setQueue([...pq]); // Visual PQ
    addLog(`[Dijkstra] Khởi tạo khoảng cách.`);

    while (pq.length > 0) {
      await sleep(ANIMATION_SPEED_MS);
      pq.sort((a, b) => a.dist - b.dist); // Min-priority
      const { id: u, dist: currentDist } = pq.shift();

      if (currentDist > distances[u]) continue;

      setCurrentNode(u);
      setQueue([...pq]);

      if (!visitedList.includes(u)) {
        visitedList.push(u);
        setVisited([...visitedList]);
      }

      addLog(`Xét đỉnh ${u} (Chi phí: ${currentDist}).`);

      if (u === endNode) {
        addLog(`Đã đến đích ${u}.`);
        break;
      }

      const neighbors = adj[u] || [];
      for (const neighbor of neighbors) {
        const v = neighbor.target;
        const weight = neighbor.weight;
        const alt = currentDist + weight;

        if (alt < distances[v]) {
          distances[v] = alt;
          previous[v] = u;
          pq.push({ id: v, dist: alt });
          setQueue([...pq]);
          addLog(`  -> Cập nhật ${v}: ${alt}`);
        }
      }
    }

    if (distances[endNode] !== Infinity) {
      reconstructPath(previous);
      setResultCost(distances[endNode]);
    } else {
      addLog("Không tìm thấy đường đi.");
    }
  };

  const reconstructPath = (parentMap) => {
    const path = [];
    let curr = endNode;
    // Safety break to prevent infinite loops in bad graph structures
    let safety = 0;
    while (curr !== null && curr !== undefined && safety < 100) {
      path.unshift(curr);
      if (curr === startNode) break;
      curr = parentMap[curr];
      safety++;
    }
    setFinalPath(path);
    setShowResult(true);
    addLog(`Hoàn thành! Đường đi: ${path.join(" -> ")}`);
  };

  // --- Handlers ---
  const addLog = (text) => {
    setLogs((prev) => [...prev, { step: prev.length, text }]);
    const container = document.getElementById("log-container");
    if (container) container.scrollTop = container.scrollHeight;
  };

  const handleCanvasClick = (e) => {
    if (mode !== "add_node") return;
    const svg = e.target.closest("svg");
    if (!svg) return;
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(screenCTM.inverse());
    const newId = String.fromCharCode(65 + nodes.length);
    setNodes([
      ...nodes,
      {
        id: nodes.length > 25 ? generateId() : newId,
        x: cursorPt.x,
        y: cursorPt.y,
      },
    ]);
  };

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    if (isRunning) return;

    if (mode === "select_points") {
      if (!startNode) setStartNode(nodeId);
      else if (!endNode && nodeId !== startNode) setEndNode(nodeId);
      else {
        setStartNode(nodeId);
        setEndNode(null);
        setFinalPath([]);
        setShowResult(false);
      }
    } else if (mode === "add_edge") {
      if (!selectedNode) setSelectedNode(nodeId);
      else {
        if (selectedNode !== nodeId) {
          const exists = edges.some(
            (edge) => edge.source === selectedNode && edge.target === nodeId
          );
          if (!exists) {
            const w = parseInt(inputWeight) || 1;
            setEdges([
              ...edges,
              { source: selectedNode, target: nodeId, weight: w },
            ]);
          }
        }
        setSelectedNode(null);
      }
    } else if (mode === "delete") {
      setNodes(nodes.filter((n) => n.id !== nodeId));
      setEdges(edges.filter((e) => e.source !== nodeId && e.target !== nodeId));
      if (startNode === nodeId) setStartNode(null);
      if (endNode === nodeId) setEndNode(null);
    }
  };

  const resetAll = () => {
    setStartNode(null);
    setEndNode(null);
    setFinalPath([]);
    setVisited([]);
    setQueue([]);
    setLogs([]);
    setCurrentNode(null);
    setShowResult(false);
    setIsRunning(false);
  };

  // Hàm xử lý khi gạt nút chuyển đổi (để tránh lỗi render dữ liệu cũ)
  const handleToggleWeighted = () => {
    if (!isRunning) {
      setIsWeighted(!isWeighted);
      // Clear visual state để tránh lỗi mismatch type (object vs string) trong Queue
      setQueue([]);
      setVisited([]);
      setFinalPath([]);
      setShowResult(false);
      setLogs([]);
    }
  };

  const handleToggleDirected = () => {
    if (!isRunning) {
      setIsDirected(!isDirected);
      setQueue([]);
      setVisited([]);
      setFinalPath([]);
      setShowResult(false);
      setLogs([]);
    }
  };

  // --- Render Helpers ---
  const calculateEdgeCoords = (u, v) => {
    const dx = v.x - u.x;
    const dy = v.y - u.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < NODE_RADIUS * 2) return { x1: u.x, y1: u.y, x2: v.x, y2: v.y };

    const ux = dx / dist;
    const uy = dy / dist;

    // Nếu có hướng: Mũi tên dừng ở mép. Nếu vô hướng: Đường thẳng nối tâm (hoặc mép)
    const x1 = u.x + ux * NODE_RADIUS;
    const y1 = u.y + uy * NODE_RADIUS;

    // Nếu có hướng thì thụt vào để vẽ mũi tên, vô hướng thì nối thẳng
    const offset = isDirected ? NODE_RADIUS + 4 : NODE_RADIUS;
    const x2 = v.x - ux * offset;
    const y2 = v.y - uy * offset;

    return { x1, y1, x2, y2, midX: (u.x + v.x) / 2, midY: (u.y + v.y) / 2 };
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800 relative">
      {/* 1. HEADER CONTROL PANEL */}
      <div className="bg-white p-3 shadow-sm border-b z-10">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 p-2 rounded text-white">
              <GitCommit size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">
                Universal Pathfinder
              </h1>
              <p className="text-xs text-slate-500">
                {isWeighted
                  ? "Dijkstra (Tối ưu chi phí)"
                  : "BFS (Ít bước nhảy nhất)"}
                {" • "}
                {isDirected ? "Có hướng" : "Vô hướng"}
              </p>
            </div>
          </div>

          {/* SETTINGS TOGGLES */}
          <div className="flex gap-4">
            {/* Weight Toggle */}
            <div
              onClick={handleToggleWeighted}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer select-none transition-colors ${isWeighted ? "bg-indigo-50 border-indigo-200" : "bg-slate-50 border-slate-200"}`}
            >
              {isWeighted ? (
                <ToggleRight className="text-indigo-600" />
              ) : (
                <ToggleLeft className="text-slate-400" />
              )}
              <span className="text-sm font-bold text-slate-600">
                {isWeighted ? "Có trọng số" : "K.Trọng số"}
              </span>
            </div>

            {/* Direction Toggle */}
            <div
              onClick={handleToggleDirected}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer select-none transition-colors ${isDirected ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-slate-200"}`}
            >
              {isDirected ? (
                <ToggleRight className="text-blue-600" />
              ) : (
                <ToggleLeft className="text-slate-400" />
              )}
              <span className="text-sm font-bold text-slate-600">
                {isDirected ? "Có hướng" : "Vô hướng"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg gap-1 items-center">
            {mode === "add_edge" && isWeighted && (
              <div className="flex items-center px-2 border-r border-slate-300 mr-2 animate-in fade-in">
                <span className="text-xs font-bold mr-1">Trọng số:</span>
                <input
                  type="number"
                  min="1"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  className="w-12 text-center text-sm border rounded outline-none"
                />
              </div>
            )}
            <button
              onClick={() => setMode("select_points")}
              className={`tool-btn ${mode === "select_points" ? "active-green" : ""}`}
            >
              <MapPin size={16} className="mr-1" /> Điểm
            </button>
            <div className="w-[1px] bg-slate-300 h-6"></div>
            <button
              onClick={() => setMode("add_node")}
              className={`tool-btn ${mode === "add_node" ? "active-blue" : ""}`}
            >
              <Plus size={16} className="mr-1" /> Đỉnh
            </button>
            <button
              onClick={() => setMode("add_edge")}
              className={`tool-btn ${mode === "add_edge" ? "active-blue" : ""}`}
            >
              <LinkIcon size={16} className="mr-1" /> Cạnh
            </button>
            <button
              onClick={() => setMode("delete")}
              className={`tool-btn ${mode === "delete" ? "active-red" : ""}`}
            >
              <Trash2 size={16} className="mr-1" /> Xóa
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={runAlgorithm}
              disabled={!startNode || !endNode || isRunning}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-transform active:scale-95"
            >
              <Play size={18} className="mr-2" />
              {isWeighted ? "Chạy Dijkstra" : "Chạy BFS"}
            </button>
            <button
              onClick={resetAll}
              className="p-2 text-slate-500 hover:bg-slate-200 rounded"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN CANVAS */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 bg-white cursor-crosshair relative">
          <div className="absolute top-2 left-2 bg-slate-800/80 text-white p-2 rounded text-xs pointer-events-none z-0">
            {!startNode
              ? "B1: Chọn Điểm Bắt đầu"
              : !endNode
                ? "B2: Chọn Điểm Đích"
                : "B3: Bấm nút Chạy"}
          </div>

          <svg width="100%" height="100%" onClick={handleCanvasClick}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
              </marker>
              <marker
                id="arrowhead-path"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#16a34a" />
              </marker>
            </defs>

            {edges.map((edge, i) => {
              const u = nodes.find((n) => n.id === edge.source);
              const v = nodes.find((n) => n.id === edge.target);
              if (!u || !v) return null;

              // Logic vẽ đường đi kết quả
              const isFinalPath =
                finalPath.length > 0 &&
                (() => {
                  for (let k = 0; k < finalPath.length - 1; k++) {
                    if (isDirected) {
                      if (
                        finalPath[k] === edge.source &&
                        finalPath[k + 1] === edge.target
                      )
                        return true;
                    } else {
                      if (
                        (finalPath[k] === edge.source &&
                          finalPath[k + 1] === edge.target) ||
                        (finalPath[k] === edge.target &&
                          finalPath[k + 1] === edge.source)
                      )
                        return true;
                    }
                  }
                  return false;
                })();

              const { x1, y1, x2, y2, midX, midY } = calculateEdgeCoords(u, v);
              const marker = isDirected
                ? isFinalPath
                  ? "url(#arrowhead-path)"
                  : "url(#arrowhead)"
                : null;

              return (
                <g key={`${edge.source}-${edge.target}-${i}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isFinalPath ? "#16a34a" : "#cbd5e1"}
                    strokeWidth={isFinalPath ? 4 : 2}
                    markerEnd={marker}
                    className="transition-all duration-500"
                  />
                  {/* Chỉ hiện trọng số nếu Weighted = true */}
                  {isWeighted && (
                    <>
                      <circle
                        cx={midX}
                        cy={midY}
                        r="9"
                        fill="white"
                        stroke={isFinalPath ? "#16a34a" : "#94a3b8"}
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={midY}
                        dy=".35em"
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#64748b"
                        className="pointer-events-none select-none"
                      >
                        {edge.weight}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {nodes.map((node) => {
              const isStart = node.id === startNode;
              const isEnd = node.id === endNode;
              const isCurrent = currentNode === node.id;
              const isVisited = visited.includes(node.id);
              const isPath = finalPath.includes(node.id);

              let fill = "white";
              let stroke = "#64748b";
              let radius = NODE_RADIUS;

              if (isStart) {
                fill = "#22c55e";
                stroke = "#14532d";
                radius = 22;
              } else if (isEnd) {
                fill = "#ef4444";
                stroke = "#7f1d1d";
                radius = 22;
              } else if (isPath) {
                fill = "#bbf7d0";
                stroke = "#16a34a";
              } else if (isCurrent) {
                fill = "#fcd34d";
                stroke = "#d97706";
              } else if (isVisited) {
                fill = "#eff6ff";
                stroke = "#bfdbfe";
              }

              if (selectedNode === node.id) stroke = "#3b82f6";

              return (
                <g
                  key={node.id}
                  onClick={(e) => handleNodeClick(e, node.id)}
                  className="cursor-pointer transition-all duration-300"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth="3"
                    className="shadow-sm"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    dy=".35em"
                    textAnchor="middle"
                    fill={isStart || isEnd ? "white" : "#334155"}
                    fontWeight="bold"
                    fontSize="12"
                    className="pointer-events-none select-none"
                  >
                    {node.id}
                  </text>

                  {isStart && (
                    <text
                      x={node.x}
                      y={node.y - 26}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#16a34a"
                      fontWeight="bold"
                    >
                      START
                    </text>
                  )}
                  {isEnd && (
                    <text
                      x={node.x}
                      y={node.y - 26}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#dc2626"
                      fontWeight="bold"
                    >
                      END
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* RIGHT PANEL: LOGS & QUEUE */}
        <div className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col shadow-xl z-20">
          <div className="h-1/3 p-4 border-b border-slate-200 flex flex-col">
            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
              {isWeighted ? "Priority Queue (Min Heap)" : "Queue (FIFO)"}
            </h3>
            <div className="flex-1 bg-white border border-slate-200 rounded p-2 overflow-y-auto flex flex-col gap-1">
              {queue.length === 0 && (
                <span className="text-slate-400 text-xs w-full text-center italic mt-4">
                  Trống
                </span>
              )}
              {queue.map((item, idx) => {
                // Kiểm tra an toàn: item có thể là object (Dijkstra) hoặc string (BFS)
                // Nếu dữ liệu bị mismatch do toggle, code này sẽ tự xử lý an toàn
                let id, dist;

                if (typeof item === "object" && item !== null) {
                  id = item.id;
                  dist = item.dist;
                } else {
                  id = item;
                  dist = null;
                }

                return (
                  <div
                    key={idx}
                    className={`flex justify-between items-center px-3 py-2 rounded text-sm animate-in slide-in-from-right-2 ${dist !== null ? "bg-indigo-50 border border-indigo-200" : "bg-cyan-50 border border-cyan-200"}`}
                  >
                    <span className="font-bold text-slate-700">Đỉnh {id}</span>
                    {dist !== null && (
                      <span className="text-xs bg-white px-1 rounded border text-slate-500">
                        Dist: {dist}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
            <h3 className="p-2 font-bold text-xs text-slate-500 uppercase tracking-wider border-b">
              Nhật ký
            </h3>
            <div
              id="log-container"
              className="flex-1 overflow-y-auto p-2 space-y-2"
            >
              {logs.map((l, i) => (
                <div
                  key={i}
                  className="text-xs text-slate-600 border-l-2 border-slate-300 pl-2"
                >
                  <span className="font-bold text-slate-400">#{l.step}: </span>
                  {l.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RESULT MODAL */}
      {showResult && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl p-6 w-96 z-50 animate-in zoom-in-95 border border-slate-200">
          <h2 className="text-xl font-bold text-center mb-4 flex justify-center items-center gap-2 text-green-600">
            <CheckCircle /> Đã tìm thấy đường!
          </h2>
          <div className="bg-slate-50 p-4 rounded border">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">
              Lộ trình:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {finalPath.map((id, idx) => (
                <React.Fragment key={idx}>
                  <span className="font-bold text-slate-800 bg-white border px-3 py-1 rounded shadow-sm">
                    {id}
                  </span>
                  {idx < finalPath.length - 1 && (
                    <ArrowRight size={14} className="text-slate-400" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {isWeighted && (
              <div className="mt-4 pt-3 border-t flex justify-between text-sm">
                <span className="text-slate-500">Tổng Trọng Số:</span>
                <span className="font-bold text-2xl text-red-600">
                  {resultCost}
                </span>
              </div>
            )}
            {!isWeighted && (
              <div className="mt-4 pt-3 border-t flex justify-between text-sm">
                <span className="text-slate-500">Số bước nhảy:</span>
                <span className="font-bold text-2xl text-blue-600">
                  {finalPath.length - 1}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowResult(false)}
            className="w-full mt-4 bg-slate-800 text-white py-2 rounded hover:bg-slate-700"
          >
            Đóng
          </button>
        </div>
      )}

      <style>{`
        .tool-btn { display: flex; align-items: center; padding: 0.5rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500; color: #475569; transition: all 0.2s; }
        .tool-btn:hover { background-color: #e2e8f0; }
        .active-green { background-color: white; color: #16a34a; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .active-blue { background-color: white; color: #0891b2; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .active-red { background-color: white; color: #dc2626; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
      `}</style>
    </div>
  );
}

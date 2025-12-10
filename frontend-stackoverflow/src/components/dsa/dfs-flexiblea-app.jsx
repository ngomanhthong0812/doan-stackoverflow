import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Plus, Trash2, Link as LinkIcon, Layers, CheckCircle, Settings, ToggleLeft, ToggleRight } from 'lucide-react';

// --- Hằng số ---
const NODE_RADIUS = 20;
const ANIMATION_SPEED_MS = 800;

// --- Helper ---
const generateId = () => Math.random().toString(36).substr(2, 4).toUpperCase();

export default function DFSFlexibleApp() {
  // --- Data ban đầu ---
  const [nodes, setNodes] = useState([
    { id: 'A', x: 250, y: 50 },
    { id: 'B', x: 150, y: 150 },
    { id: 'C', x: 350, y: 150 },
    { id: 'D', x: 100, y: 280 },
    { id: 'E', x: 200, y: 280 },
    { id: 'F', x: 400, y: 280 },
  ]);
  
  const [edges, setEdges] = useState([
    { source: 'A', target: 'B', weight: 4 },
    { source: 'A', target: 'C', weight: 2 },
    { source: 'B', target: 'D', weight: 5 },
    { source: 'B', target: 'E', weight: 10 },
    { source: 'C', target: 'F', weight: 3 },
    { source: 'E', target: 'F', weight: 1 },
  ]);

  // --- State Tương tác ---
  const [mode, setMode] = useState('select_start');
  const [selectedNode, setSelectedNode] = useState(null);
  const [inputWeight, setInputWeight] = useState(5); 
  const [isWeighted, setIsWeighted] = useState(false); // <--- TÍNH NĂNG MỚI: Bật/Tắt Trọng Số

  // --- State Thuật toán ---
  const [isRunning, setIsRunning] = useState(false);
  const [visited, setVisited] = useState([]); 
  const [stack, setStack] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [logs, setLogs] = useState([]);
  
  // --- State Kết quả ---
  const [traversalPath, setTraversalPath] = useState([]); 
  const [totalCost, setTotalCost] = useState(0); 
  const [showResult, setShowResult] = useState(false); 

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // --- CORE DFS ALGORITHM ---
  const runDFS = async (startNodeId) => {
    if (isRunning) return;
    setIsRunning(true);
    setShowResult(false);
    setVisited([]);
    setStack([]);
    setTraversalPath([]);
    setTotalCost(0);
    setLogs([{ step: 0, text: `Khởi động DFS từ đỉnh ${startNodeId} (${isWeighted ? 'Có trọng số' : 'Không trọng số'})` }]);

    // 1. Chuẩn bị Adjacency List
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      // Nếu không có trọng số, ta mặc định weight = 0 hoặc 1 để code chạy, nhưng không dùng để sort
      const w = isWeighted ? e.weight : 1;
      adj[e.source].push({ target: e.target, weight: w });
      adj[e.target].push({ target: e.source, weight: w });
    });

    // 2. SẮP XẾP DANH SÁCH KỀ
    Object.keys(adj).forEach(key => {
        if (isWeighted) {
            // Nếu có trọng số: Ưu tiên trọng số nhỏ
            adj[key].sort((a, b) => a.weight - b.weight);
        } else {
            // Nếu không trọng số: Ưu tiên thứ tự Alpha (A -> B -> C) để ổn định
            adj[key].sort((a, b) => a.target.localeCompare(b.target));
        }
    });

    const visitedSet = new Set();
    const stackTracker = []; 
    const pathTracker = [];
    let currentTotalCost = 0;

    const dfsRecursive = async (u, costToHere) => {
      visitedSet.add(u);
      stackTracker.push(u);
      pathTracker.push(u);
      
      setCurrentNode(u);
      setStack([...stackTracker]);
      setVisited(Array.from(visitedSet));
      setTraversalPath([...pathTracker]);
      
      // Chỉ cộng chi phí nếu đang ở chế độ Có Trọng Số
      if (isWeighted && costToHere > 0) {
          currentTotalCost += costToHere;
          setTotalCost(currentTotalCost);
      }

      if (isWeighted) {
          addLog(`Đến đỉnh ${u}. Tổng chi phí: ${currentTotalCost}`);
      } else {
          addLog(`Đến đỉnh ${u}.`);
      }
      
      await sleep(ANIMATION_SPEED_MS);

      const neighbors = adj[u] || [];
      
      for (const neighbor of neighbors) {
        if (!visitedSet.has(neighbor.target)) {
          if (isWeighted) {
              addLog(`  -> Chọn đường ${u}-${neighbor.target} (Trọng số ${neighbor.weight}) vì nhỏ nhất.`);
          } else {
              addLog(`  -> Chọn đường ${u}-${neighbor.target} (Theo thứ tự chữ cái).`);
          }
          
          await dfsRecursive(neighbor.target, neighbor.weight);
          
          // Backtrack
          setCurrentNode(u);
          setStack([...stackTracker]);
          addLog(`  <- Quay lui về ${u}.`);
          await sleep(ANIMATION_SPEED_MS);
        }
      }

      stackTracker.pop();
      setStack([...stackTracker]);
      addLog(`${u} đã duyệt xong. Rút khỏi Stack.`);
      await sleep(ANIMATION_SPEED_MS);
    };

    await dfsRecursive(startNodeId, 0);

    setIsRunning(false);
    setCurrentNode(null);
    setShowResult(true); 
    addLog("Hoàn thành quá trình duyệt!");
  };

  const addLog = (text) => {
    setLogs(prev => [...prev, { step: prev.length, text }]);
    const container = document.getElementById('log-container');
    if (container) container.scrollTop = container.scrollHeight;
  };

  // --- Handlers ---
  const handleCanvasClick = (e) => {
    if (mode !== 'add_node') return;
    const svg = e.target.closest('svg');
    if (!svg) return;
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(screenCTM.inverse());

    const newId = String.fromCharCode(65 + nodes.length);
    setNodes([...nodes, { id: nodes.length > 25 ? generateId() : newId, x: cursorPt.x, y: cursorPt.y }]);
  };

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    if (isRunning) return;

    if (mode === 'add_edge') {
      if (!selectedNode) {
        setSelectedNode(nodeId);
      } else {
        if (selectedNode !== nodeId) {
           const exists = edges.some(edge => 
            (edge.source === selectedNode && edge.target === nodeId) ||
            (edge.source === nodeId && edge.target === selectedNode)
          );
          if (!exists) {
              const weightVal = parseInt(inputWeight);
              const finalWeight = isNaN(weightVal) ? 1 : weightVal;
              setEdges([...edges, { source: selectedNode, target: nodeId, weight: finalWeight }]);
          }
        }
        setSelectedNode(null);
      }
    } else if (mode === 'select_start') {
      runDFS(nodeId);
    } else if (mode === 'delete') {
      setNodes(nodes.filter(n => n.id !== nodeId));
      setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
    }
  };

  const resetGraph = () => {
    setVisited([]);
    setStack([]);
    setLogs([]);
    setTraversalPath([]);
    setTotalCost(0);
    setCurrentNode(null);
    setIsRunning(false);
    setShowResult(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800 relative">
      
      {/* 1. HEADER */}
      <div className="bg-white p-3 shadow-sm border-b flex flex-wrap gap-4 justify-between items-center z-10">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="bg-orange-600 p-2 rounded text-white"><Layers size={20} /></div>
                <div>
                    <h1 className="font-bold text-lg">DFS Visualizer</h1>
                    <p className="text-xs text-slate-500">Mô phỏng thuật toán duyệt đồ thị</p>
                </div>
            </div>
            
            {/* TOGGLE SWITCH TRỌNG SỐ */}
            <div 
                onClick={() => !isRunning && setIsWeighted(!isWeighted)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors select-none ${isWeighted ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}
                title="Bật/Tắt tính năng trọng số"
            >
                {isWeighted ? <ToggleRight className="text-indigo-600" size={24}/> : <ToggleLeft className="text-slate-400" size={24}/>}
                <span className={`text-sm font-semibold ${isWeighted ? 'text-indigo-700' : 'text-slate-500'}`}>
                    {isWeighted ? 'Có trọng số' : 'Không trọng số'}
                </span>
            </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg gap-1 items-center">
             {/* Chỉ hiện ô nhập trọng số khi bật chế độ Weighted */}
             {mode === 'add_edge' && isWeighted && (
                <div className="flex items-center px-2 border-r border-slate-300 mr-1 animate-in fade-in slide-in-from-right-2">
                    <span className="text-xs font-bold mr-1">Trọng số:</span>
                    <input 
                        type="number" min="1" max="99" 
                        value={inputWeight} onChange={(e)=>setInputWeight(e.target.value)}
                        className="w-12 text-center text-sm border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            )}

            <button onClick={() => setMode('select_start')} className={`tool-btn ${mode === 'select_start' ? 'active-green' : ''}`}>
                <Play size={16} className="mr-1"/> Chạy
            </button>
            <div className="w-[1px] bg-slate-300 h-6"></div>
            <button onClick={() => setMode('add_node')} className={`tool-btn ${mode === 'add_node' ? 'active-blue' : ''}`}>
                <Plus size={16} className="mr-1"/> Đỉnh
            </button>
            <button onClick={() => setMode('add_edge')} className={`tool-btn ${mode === 'add_edge' ? 'active-blue' : ''}`}>
                <LinkIcon size={16} className="mr-1"/> Cạnh
            </button>
             <button onClick={() => setMode('delete')} className={`tool-btn ${mode === 'delete' ? 'active-red' : ''}`}>
                <Trash2 size={16} className="mr-1"/> Xóa
            </button>
        </div>

        <button onClick={resetGraph} className="p-2 text-slate-500 hover:bg-slate-200 rounded transition-colors">
            <RotateCcw size={20} />
        </button>
      </div>

      {/* 2. MAIN AREA */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* CANVAS */}
        <div className="flex-1 bg-white cursor-crosshair relative">
             <div className="absolute top-2 left-2 bg-slate-800/80 text-white p-2 rounded text-xs pointer-events-none z-0">
                {mode === 'select_start' ? "Chọn một đỉnh để bắt đầu duyệt." : 
                 mode === 'add_edge' ? "Chọn điểm đầu -> điểm cuối để nối." : 
                 "Tương tác trên bảng vẽ..."}
            </div>

            <svg width="100%" height="100%" onClick={handleCanvasClick}>
                {edges.map((edge, i) => {
                    const u = nodes.find(n => n.id === edge.source);
                    const v = nodes.find(n => n.id === edge.target);
                    if(!u || !v) return null;
                    
                    const isTraversed = visited.includes(edge.source) && visited.includes(edge.target);
                    
                    // Midpoint for weight label
                    const midX = (u.x + v.x) / 2;
                    const midY = (u.y + v.y) / 2;

                    return (
                        <g key={`${edge.source}-${edge.target}`}>
                            <line 
                                x1={u.x} y1={u.y} x2={v.x} y2={v.y}
                                stroke={isTraversed ? "#f97316" : "#cbd5e1"}
                                strokeWidth={isTraversed ? 3 : 2}
                                className="transition-all duration-500"
                            />
                            {/* Chỉ hiển thị số trọng số khi isWeighted = true */}
                            {isWeighted && (
                                <>
                                    <circle cx={midX} cy={midY} r="10" fill="white" stroke="#94a3b8" strokeWidth="1"/>
                                    <text x={midX} y={midY} dy=".35em" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569" className="pointer-events-none select-none">
                                        {edge.weight}
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}

                {nodes.map(node => {
                    const isCurrent = currentNode === node.id;
                    const isVisited = visited.includes(node.id);
                    const isInStack = stack.includes(node.id);
                    
                    let fill = "white";
                    let stroke = "#64748b";

                    if (isCurrent) { fill = "#f97316"; stroke = "#c2410c"; } // Orange-500
                    else if (isInStack) { fill = "#fdba74"; stroke = "#f97316"; } // Orange-300
                    else if (isVisited) { fill = "#3b82f6"; stroke = "#1d4ed8"; } // Blue-500

                    if (selectedNode === node.id) stroke = "#22c55e";

                    return (
                        <g key={node.id} onClick={(e) => handleNodeClick(e, node.id)} className="cursor-pointer transition-all duration-300">
                            <circle 
                                cx={node.x} cy={node.y} r={NODE_RADIUS}
                                fill={fill} stroke={stroke} strokeWidth="3"
                                className="shadow-sm"
                            />
                            <text 
                                x={node.x} y={node.y} dy=".35em" textAnchor="middle"
                                fill={isCurrent || isVisited || isInStack ? "white" : "#334155"} fontWeight="bold" fontSize="12"
                                className="pointer-events-none select-none"
                            >
                                {node.id}
                            </text>
                            {/* Đã xóa phần hiển thị thứ tự duyệt (#1, #2) tại đây */}
                        </g>
                    );
                })}
            </svg>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col shadow-xl z-20">
            {/* Stack Visual */}
            <div className="h-1/2 p-4 border-b border-slate-200 flex flex-col">
                <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Layers size={16}/> Stack (LIFO)</h3>
                <div className="flex-1 border-2 border-slate-300 border-t-0 rounded-b bg-white relative overflow-y-auto flex flex-col-reverse p-2 gap-1">
                     {stack.map((id, idx) => (
                        <div key={idx} className="bg-orange-100 text-orange-800 border border-orange-200 p-2 text-center font-bold rounded animate-in slide-in-from-top-2">
                            {id}
                        </div>
                     ))}
                     {stack.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-sm">Stack Rỗng</div>}
                </div>
            </div>

            {/* Live Stats */}
            <div className="p-4 bg-white border-b border-slate-200">
                 <div className="flex justify-between items-center text-sm mb-1">
                     <span className="text-slate-500">Đã duyệt:</span>
                     <span className="font-bold text-blue-600">{visited.length} / {nodes.length} đỉnh</span>
                 </div>
                 {/* Chỉ hiện thống kê Cost khi ở chế độ Có trọng số */}
                 {isWeighted && (
                    <div className="flex justify-between items-center text-sm animate-in fade-in">
                        <span className="text-slate-500">Tổng trọng số:</span>
                        <span className="font-bold text-red-600 text-lg">{totalCost}</span>
                    </div>
                 )}
            </div>

            {/* Logs */}
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
                <h3 className="p-2 font-bold text-xs text-slate-500 uppercase tracking-wider border-b">Nhật ký hoạt động</h3>
                <div id="log-container" className="flex-1 overflow-y-auto p-2 space-y-2">
                    {logs.map((l, i) => (
                        <div key={i} className="text-xs text-slate-600 border-l-2 border-slate-300 pl-2">
                            <span className="font-bold text-slate-400">B{l.step}: </span>{l.text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* 3. RESULT MODAL (POPUP) */}
      {showResult && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-96 max-w-full m-4">
                <div className="flex items-center gap-3 mb-4 text-green-600">
                    <CheckCircle size={32} />
                    <h2 className="text-2xl font-bold text-slate-800">Hoàn Thành!</h2>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Thứ tự duyệt (Path):</p>
                        <div className="flex flex-wrap gap-2">
                            {traversalPath.map((nodeId, idx) => (
                                <div key={idx} className="flex items-center">
                                    <span className="font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">{nodeId}</span>
                                    {idx < traversalPath.length - 1 && <span className="mx-1 text-slate-300">→</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chỉ hiện Tổng Trọng Số khi isWeighted = true */}
                    {isWeighted ? (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-600">Tổng trọng số cây duyệt:</span>
                            <span className="text-xl font-bold text-red-600">{totalCost}</span>
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center text-sm text-slate-500 italic">
                            Chế độ không trọng số (Unweighted).
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={() => setShowResult(false)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
      )}

      <style>{`
        .tool-btn {
            display: flex; align-items: center; padding: 0.5rem 0.75rem; 
            border-radius: 0.375rem; font-size: 0.875rem; font-weight: 500;
            color: #475569; transition: all 0.2s;
        }
        .tool-btn:hover { background-color: #e2e8f0; }
        .active-green { background-color: white; color: #16a34a; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .active-blue { background-color: white; color: #2563eb; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .active-red { background-color: white; color: #dc2626; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
      `}</style>
    </div>
  );
}
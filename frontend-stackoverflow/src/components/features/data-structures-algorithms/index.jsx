import React, { useState } from "react";
import UniversalPathfinder from "@/components/dsa/universal-pathfinder";
import DFSFlexibleApp from "@/components/dsa/dfs-flexiblea-app";
import BubbleSortVisualizer from "@/components/dsa/bubble-sort-visualizer";
import MergeSortVisualizer from "@/components/dsa/merge-sort-visualizer";

export default function DataStructuresAlgorithms() {
  const pages = [
    { label: "Tìm kiếm tuyến tính", type: "html", file: "tim-kiem-tuyen-tinh" },
    { label: "Tìm kiếm nhị phân", type: "html", file: "tim-kiem-nhi-phan" },
    {
      label: "Giải thuật sắp xếp nổi bọt",
      type: "react",
      component: BubbleSortVisualizer,
    },
    {
      label: "Giải thuật tìm kiếm theo chiều rộng",
      type: "react",
      component: UniversalPathfinder,
    },
    {
      label: "Giải thuật tìm kiếm theo chiều sâu",
      type: "react",
      component: DFSFlexibleApp,
    },
    {
      label: "Giải thuật sắp xếp trộn",
      type: "react",
      component: MergeSortVisualizer,
    },
  ];

  const [selected, setSelected] = useState(pages[0]);

  return (
    <div className="flex h-[90vh] gap-4">
      {/* MENU */}
      <div className="w-64 border-r p-3 space-y-1 bg-gray-50 rounded">
        <h2 className="text-lg font-semibold mb-3">Thuật toán</h2>

        {pages.map((page) => (
          <button
            key={page.label}
            onClick={() => setSelected(page)}
            className={`w-full text-left px-3 py-2 rounded hover:bg-gray-200 ${
              selected.label === page.label
                ? "bg-gray-300 font-bold"
                : "bg-gray-100"
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* HIỂN THỊ */}
      <div className="flex-1 border rounded p-2 overflow-auto">
        {selected.type === "html" ? (
          <iframe
            src={`/dsa/${selected.file}.html`}
            className="w-full h-full border rounded"
            title={selected.label}
          />
        ) : (
          <selected.component />
        )}
      </div>
    </div>
  );
}

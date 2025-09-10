import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import QuestionItem from "./question-item";
import { _getQuestions } from "@/services/question";
import Pagination from "../pagination";
import RenderSkeleton from "../render-skeleton";

// Filter Panel
function FilterBy({ filter, updateFilter, onApply, onClear }) {
  const checkboxes = [{ key: "noAnswers", label: "No answers" }];

  const radios = [
    { key: "newest", label: "Newest" },
    { key: "recent", label: "Recent activity" },
    { key: "highest", label: "Highest score" },
    { key: "frequent", label: "Most frequent" },
    { key: "bounty", label: "Bounty ending soon" },
    { key: "trending", label: "Trending" },
    { key: "activity", label: "Most activity" },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 p-4 text-sm">
      {/* Cột 1 - Filter by */}
      <div>
        <h3 className="font-semibold mb-2">Filter by</h3>
        <div className="flex flex-col gap-2">
          {checkboxes.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filter[key] || false}
                onChange={(e) => updateFilter(key, e.target.checked)}
                className="h-4 w-4"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Cột 2 - Sorted by */}
      <div>
        <h3 className="font-semibold mb-2">Sorted by</h3>
        <div className="flex flex-col gap-2">
          {radios.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="radio"
                name="sortedBy"
                value={key}
                checked={filter.sortedBy === key}
                onChange={(e) => updateFilter("sortedBy", e.target.value)}
                className="h-4 w-4"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="col-span-2 my-2 border-t" />
      <div className="col-span-2 flex justify-between">
        <button
          onClick={onClear}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
        >
          Clear
        </button>
        <button
          onClick={onApply}
          className="px-3 py-1 text-sm bg-[#1b75d0] hover:bg-[#155ca2] text-white rounded"
        >
          Apply filter
        </button>
      </div>
    </div>
  );
}

export default function QuestionFilter({ search }) {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState({
    noAnswers: false,
    sortedBy: "newest",
  });
  const [appliedFilter, setAppliedFilter] = useState(filter);

  const [pagination, setPagination] = useState();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQues = async () => {
      setLoading(true);
      try {
        const res = await _getQuestions({
          page,
          perPage,
          noAnswers: appliedFilter.noAnswers,
          sortedBy: appliedFilter.sortedBy,
          search,
        });
        setQuestions(res.data);
        setPagination(res.pagination);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQues();
  }, [page, perPage, appliedFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [perPage]);

  const updateFilter = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilter = () => {
    setAppliedFilter(filter);
    setPage(1);
  };

  const clearFilter = () => {
    const defaultFilter = {
      noAnswers: false,
      sortedBy: "newest",
    };
    setFilter(defaultFilter);
    setAppliedFilter(defaultFilter);
    setPage(1);
  };

  return (
    <>
      <div className="flex flex-col mt-4 relative pl-6">
        <div className="flex items-center justify-between pb-2">
          {/* Title */}
          <h2 className="text-lg font-semibold">
            {pagination?.totalQuestions?.toLocaleString() || 0} questions
          </h2>

          {/* Tabs + Filter */}
          <div className="flex items-center gap-2">
            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#1b75d0] text-[#1b75d0] hover:bg-blue-400/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="h-4 w-4 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 4.5h18m-12 6h6m-3 6h0"
                    />
                  </svg>
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-xl mt-5" align="end">
                <FilterBy
                  filter={filter}
                  updateFilter={updateFilter}
                  onApply={applyFilter}
                  onClear={clearFilter}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="border-t">
        {questions &&
          questions.length > 0 &&
          questions.map((question) => (
            <QuestionItem key={question._id} {...question} />
          ))}
        {loading && <RenderSkeleton className="grid-cols-1" length={4} />}
      </div>

      {pagination?.totalPages > 1 && (
        <Pagination
          className="pl-6 py-4 mt-6"
          currentPage={page}
          totalPages={pagination?.totalPages}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      )}
    </>
  );
}

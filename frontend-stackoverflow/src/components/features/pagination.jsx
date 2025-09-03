import { cn } from "@/lib/utils";

export default function Pagination({
  className,
  totalPages = 100,
  currentPage = 1,
  perPage = 15,
  onPageChange,
  onPerPageChange,
}) {
  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 3) return [1, 2, 3, 4, "..."];
    if (currentPage >= totalPages - 2)
      return [
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];

    return ["...", currentPage - 1, currentPage, currentPage + 1, "..."];
  };

  const pages = getPages();
  const perPageOptions = [15, 30, 50];

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm justify-between",
        className
      )}
    >
      {/* Pages */}
      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={i} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={page}
              disabled={page === currentPage}
              onClick={() => onPageChange?.(page)}
              className={cn(
                "w-6 h-6 border rounded-sm flex items-center justify-center transition",
                page === currentPage
                  ? "bg-orange-500 text-white border-orange-500 cursor-not-allowed"
                  : "bg-white text-blue-800 border-gray-300 hover:bg-gray-100"
              )}
            >
              {page}
            </button>
          )
        )}

        {/* Last page */}
        {!pages.includes(totalPages) && (
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange?.(totalPages)}
            className={cn(
              "w-12 h-8 border rounded-sm bg-white text-blue-800 border-gray-300 hover:bg-gray-100",
              currentPage === totalPages && "cursor-not-allowed opacity-60"
            )}
          >
            {totalPages}
          </button>
        )}

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          className={cn(
            "w-12 h-8 border rounded-sm bg-white text-blue-800 border-gray-300 hover:bg-gray-100",
            currentPage === totalPages && "cursor-not-allowed opacity-60"
          )}
        >
          Next
        </button>
      </div>

      {/* Per page */}
      <div className="ml-6 flex items-center gap-2">
        {perPageOptions.map((n) => (
          <button
            key={n}
            disabled={n === perPage}
            onClick={() => onPerPageChange?.(n)}
            className={cn(
              "w-8 h-6 border rounded-sm flex items-center justify-center transition",
              n === perPage
                ? "bg-orange-500 text-white border-orange-500 cursor-not-allowed"
                : "bg-white text-blue-800 border-gray-300 hover:bg-gray-100"
            )}
          >
            {n}
          </button>
        ))}
        <span className="text-gray-600 text-xs">per page</span>
      </div>
    </div>
  );
}

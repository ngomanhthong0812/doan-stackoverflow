import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import TagItem from "./tag-item";
import { _getTags } from "@/services/tag";
import Pagination from "../pagination";
import RenderSkeleton from "../render-skeleton";

export default function TagFilter() {
  const tabs = ["popular", "name", "new"];
  const [activeTab, setActiveTab] = useState("popular");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [pagination, setPagination] = useState();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const [tagsByTab, setTagsByTab] = useState({
    popular: [],
    name: [],
    new: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [perPage, search]);

  // debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const data = await _getTags({
          page,
          perPage,
          search: debouncedSearch,
          sortBy: activeTab,
        });
        setPagination(data.pagination);
        setTagsByTab((prev) => ({
          ...prev,
          [activeTab]: data.data,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [debouncedSearch, activeTab, page, perPage]);

  return (
    <div className="flex flex-col w-full gap-4 mt-7 pl-6">
      <div className="flex items-center gap-4 w-full">
        <div className="relative flex-1">
          <Input
            type="text"
            value={search}
            placeholder="Filter by tag name"
            className="w-fit pl-8"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500"
            size={17}
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-none"
        >
          <TabsList className="flex gap-2">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {loading && <RenderSkeleton />}
            {!loading && tagsByTab[tab].length === 0 && (
              <p className="text-gray-500">No tags found</p>
            )}
            {!loading && tagsByTab[tab].length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {tagsByTab[tab].map((tag) => (
                  <TagItem key={tag._id} tag={tag} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      {pagination?.totalPages > 1 && (
        <Pagination
          className="pl-6 py-4 mt-6"
          currentPage={page}
          totalPages={pagination?.totalPages}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
          perPage={perPage}
        />
      )}
    </div>
  );
}

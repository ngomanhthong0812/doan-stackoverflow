import { useState, useEffect } from "react";
import { TagsInput } from "../question/ask/ask-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { toast } from "sonner";

export default function WatchedTags({ selectedTags, setSelectedTags }) {
  const [tempTags, setTempTags] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("watchedTags");
    if (saved) {
      setSelectedTags(JSON.parse(saved));
    } else {
      setOpen(true);
    }
  }, [setSelectedTags]);

  useEffect(() => {
    if (open) {
      setTempTags(selectedTags);
    }
  }, [open, selectedTags]);

  const handleAddTags = () => {
    if (tempTags.length === 0) {
      toast.error("Please add at least 1 tag.");
      return;
    }

    setSelectedTags(tempTags);
    localStorage.setItem("watchedTags", JSON.stringify(tempTags));
    setTempTags([]);
    setOpen(false);
  };

  return (
    <div className="border p-4 rounded-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold">Watched Tags</h2>

        <Dialog
          open={open}
          onOpenChange={(val) => {
            // Nếu chưa có tag nào, không cho đóng dialog
            if (selectedTags.length === 0 && !val) return;
            setOpen(val);
          }}
        >
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Watched Tags</DialogTitle>
            </DialogHeader>

            <TagsInput setTags={setTempTags} tags={tempTags} isdes={false} />

            <div className="flex justify-end mt-4">
              <Button
                className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white"
                onClick={handleAddTags}
              >
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Hiển thị selectedTags */}
      <div className="flex flex-wrap gap-2 my-2">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <span
              key={tag._id}
              className="p-1 font-bold rounded-sm bg-gray-100 text-xs"
            >
              {tag.name}
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-400 italic">No tags selected</p>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Customize your content by watching tags.
      </p>
    </div>
  );
}

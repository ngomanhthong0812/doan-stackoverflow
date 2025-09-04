import { Button } from "@/components/ui/button";
import TagFilter from "./tag-filter";
import { useAuth } from "@/contexts/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { _createTags } from "@/services/tag";
import { toast } from "sonner";

export default function Tag() {
  const { user } = useAuth();
  const [tagName, setTagName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  const handleAddTag = async () => {
    if (!tagName.trim() || !description.trim()) return;
    try {
      await _createTags({ name: tagName, description });
      toast.success("Tag created successfully!");
      setTagName("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="flex">
      <main className="flex-1">
        <div className="flex flex-col pl-6 gap-4">
          <h1 className="!text-2xl">Tags</h1>
          <p className="max-w-2xl text-gray-600">
            A tag is a keyword or label that categorizes your question with
            other, similar questions. Using the right tags makes it easier for
            others to find and answer your question.
          </p>

          {user && user.role === "admin" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white w-fit">
                  Add Tag
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Tag</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={tagName}
                      onChange={(e) => setTagName(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter tag name"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right mt-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter tag description"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddTag}
                    disabled={!tagName.trim() || !description.trim()}
                    className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <TagFilter />
      </main>
    </section>
  );
}

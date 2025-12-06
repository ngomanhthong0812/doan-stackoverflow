import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileArchive,
  FileSpreadsheet,
  FileType2,
  ImageIcon,
  X,
  FileText,
  File,
} from "lucide-react";
import { _uploadFiles } from "@/services/shared-file";
import { _uploadMultiple } from "@/services/upload";
import { toast } from "sonner";

export default function UploadFileModal({
  open,
  onOpenChange,
  folderId,
  onUploaded,
  fetchFolders,
}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleChooseFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    if (inputRef.current) inputRef.current.value = null;
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    try {
      setUploading(true);
      const uploadedFiles = await _uploadMultiple(files);
      const res = await _uploadFiles({ folderId, data: uploadedFiles });
      onUploaded?.(res.data);
      setFiles([]);
      onOpenChange(false);
      fetchFolders();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext))
      return <ImageIcon size={28} />;
    if (ext === "pdf") return <FileText size={28} />;
    if (["doc", "docx"].includes(ext)) return <FileType2 size={28} />;
    if (["xls", "xlsx"].includes(ext)) return <FileSpreadsheet size={28} />;
    if (["zip", "rar"].includes(ext)) return <FileArchive size={28} />;
    return <File size={28} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChooseFiles}
          className="mb-3"
        />

        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto p-1">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative border rounded-md p-3 flex flex-col items-center justify-center text-sm bg-gray-50"
              >
                <span className="text-3xl mb-1">{getFileIcon(file.name)}</span>
                <p className="text-xs text-center truncate w-full">
                  {file.name}
                </p>

                {/* Nút xóa file */}
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-black/40 text-white rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="flex justify-end gap-2 mt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white w-fit"
          >
            {uploading ? "Uploading..." : `Upload (${files.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

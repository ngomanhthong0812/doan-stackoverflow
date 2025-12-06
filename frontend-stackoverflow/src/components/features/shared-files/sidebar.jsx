import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { _deleteFolder } from "@/services/shared-file";
import { toast } from "sonner";

export default function Sidebar({
  folders,
  selectedFolder,
  onSelectFolder,
  onRefresh,
  fetchFolders,
}) {
  const { user } = useAuth();

  const canDeleteFolder = (folder) => {
    if (user?.role === "admin") return true;
    return folder.files.length === 0 && user;
  };

  const handleDeleteFolder = async (folderId, folderName) => {
    if (!confirm(`Bạn có chắc muốn xoá folder "${folderName}"?`)) return;

    try {
      await _deleteFolder(folderId);
      fetchFolders();
      toast.success("Xoá folder thành công!");
      onRefresh?.();
    } catch (error) {
      toast.error("Không thể xoá folder!");
      console.error(error);
    }
  };

  return (
    <div className="w-64 border-r bg-gray-50 p-2 overflow-y-auto">
      {folders.map((folder) => {
        const allowDelete = canDeleteFolder(folder);

        return (
          <div
            key={folder._id}
            className={`group p-2 cursor-pointer hover:bg-gray-100 rounded-md flex justify-between items-center ${
              selectedFolder?._id === folder._id ? "bg-gray-100" : ""
            }`}
            onClick={() => onSelectFolder(folder)}
          >
            <span>{folder.title}</span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {folder.files.length} files
              </span>

              {allowDelete && (
                <button
                  className="p-1 rounded hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFolder(folder._id, folder.title);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useAuth } from "@/contexts/auth";
import { _deleteFile } from "@/services/shared-file";
import {
  FileText,
  Image,
  Music,
  Video,
  Code,
  FileArchive,
  File,
  Download,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

export default function FolderDetail({ folder, fetchFolders }) {
  const { user } = useAuth();
  if (!folder)
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
        <File className="w-16 h-16 mb-4 opacity-20" />
        <p>Select a folder to see details</p>
      </div>
    );

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    const commonClasses = "w-8 h-8 mb-3";

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) {
      return <Image className={`${commonClasses} text-purple-500`} />;
    }
    if (["mp4", "webm", "ogg", "mov"].includes(ext)) {
      return <Video className={`${commonClasses} text-red-500`} />;
    }
    if (["mp3", "wav", "flac"].includes(ext)) {
      return <Music className={`${commonClasses} text-pink-500`} />;
    }
    if (["js", "jsx", "ts", "tsx", "html", "css", "json", "py"].includes(ext)) {
      return <Code className={`${commonClasses} text-yellow-500`} />;
    }
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
      return <FileArchive className={`${commonClasses} text-orange-500`} />;
    }
    if (["pdf", "doc", "docx", "txt", "md"].includes(ext)) {
      return <FileText className={`${commonClasses} text-blue-500`} />;
    }
    return <File className={`${commonClasses} text-gray-500`} />;
  };

  const handleDeleteFile = async (fileUrl) => {
    if (!confirm(`Bạn có chắc muốn xoá file?`)) return;
    try {
      await _deleteFile({ fileUrl, folderId: folder._id });
      fetchFolders();
      toast.success("Deleted!");
    } catch (err) {
      console.error(err);
      alert("Error deleting file");
    }
  };

  return (
    <div className="flex-1 p-6 bg-white overflow-y-auto">
      <div className="mb-8 border-b pb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {folder.title}
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-600">
            Created by {folder.createdBy.username}
          </span>
          <span className="mx-2">•</span>
          <span>{folder.files.length} files</span>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
          Files
          <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {folder.files.length}
          </span>
        </h4>

        {folder.files.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">
              No files in this folder yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {folder.files.map((file) => {
              const canDelete =
                file.uploadedBy._id === user?._id || user?.role === "admin";

              return (
                <div
                  key={file._id}
                  className="group relative flex flex-col items-center p-4 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:shadow-blue-50 transition-all duration-200"
                >
                  {/* Nút xoá */}
                  {canDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteFile(file.fileUrl);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}

                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex flex-col items-center w-full"
                  >
                    {getFileIcon(file.fileName)}

                    <h5 className="font-medium text-gray-700 text-sm text-center line-clamp-2 w-full break-words group-hover:text-blue-600 transition-colors">
                      {file.fileName}
                    </h5>
                  </a>

                  <div className="mt-4 w-full flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 uppercase">
                        {file.uploadedBy.username.charAt(0)}
                      </div>
                      <span className="text-xs text-gray-400 truncate max-w-[60px]">
                        {file.uploadedBy.username}
                      </span>
                    </div>

                    <Download className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

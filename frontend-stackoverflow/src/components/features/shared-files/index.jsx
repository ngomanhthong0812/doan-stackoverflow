import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Sidebar from "./sidebar";
import FolderDetail from "./folder-detail";
import CreateFolderModal from "./create-folder-modal";
import UploadFileModal from "./upload-file-modal";
import {
  _getSharedFolders,
  _createFolder,
  _uploadFiles,
  _addComment,
} from "@/services/shared-file";

export default function SharedFiles() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const currentUser = { username: "You" };

  useEffect(() => {
    fetchFolders();
  }, []);


  const fetchFolders = async () => {
    try {
      const res = await _getSharedFolders({ page: 1, perPage: 50 });
      setFolders(res.data);
      if (res.data.length > 0) setSelectedFolder(res.data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateFolder = async (title) => {
    try {
      const res = await _createFolder({ title, description: "" });
      setFolders([res.data, ...folders]);
      setIsFolderModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadFile = async (files) => {
    if (!selectedFolder) return;
    try {
      const res = await _uploadFiles({ folderId: selectedFolder._id, files });
      setFolders(
        folders.map((f) => (f._id === selectedFolder._id ? res.data : f))
      );
      setSelectedFolder(res.data);
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (folderId, content) => {
    try {
      const res = await _addComment({ folderId, content });
      setFolders(folders.map((f) => (f._id === folderId ? res.data : f)));
      setSelectedFolder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Shared Files</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsFolderModalOpen(true)}
            className="!bg-[#1b75d0] hover:!bg-[#155ca2] text-white w-fit"
          >
            Create Folder
          </Button>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="!bg-[#15a238] hover:!bg-[#107c2b] text-white w-fit"
          >
            Upload File
          </Button>
        </div>
      </div>

      <div className="flex h-[80vh] border rounded-md overflow-hidden shadow-sm">
        <Sidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
        />
        <FolderDetail
          folder={selectedFolder}
          currentUser={currentUser}
          onAddComment={handleAddComment}
        />
      </div>

      <CreateFolderModal
        open={isFolderModalOpen}
        onOpenChange={setIsFolderModalOpen}
        onCreate={handleCreateFolder}
      />
      <UploadFileModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUpload={handleUploadFile}
        folderId={selectedFolder?._id}
      />
    </div>
  );
}

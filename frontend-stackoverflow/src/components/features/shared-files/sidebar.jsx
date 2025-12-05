export default function Sidebar({ folders, selectedFolder, onSelectFolder }) {
  return (
    <div className="w-64 border-r bg-gray-50 p-2 overflow-y-auto">
      {folders.map((folder) => (
        <div
          key={folder._id}
          className={`p-2 cursor-pointer hover:bg-gray-100 rounded-md flex justify-between items-center ${
            selectedFolder?._id === folder._id ? "bg-gray-100" : ""
          }`}
          onClick={() => onSelectFolder(folder)}
        >
          <span>{folder.title}</span>
          <span className="text-xs text-gray-500">
            {folder.files.length} files
          </span>
        </div>
      ))}
    </div>
  );
}

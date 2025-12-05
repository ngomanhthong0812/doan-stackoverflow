import axios from "@/config/axios";

export const _getSharedFolders = async () => {
  const res = await axios.get("/sharedFile");
  return res.data;
};

export const _getFolderDetail = async (folderId) => {
  const res = await axios.get(`/sharedFile/${folderId}`);
  return res.data;
};

export const _createFolder = async ({ title, description }) => {
  const res = await axios.post("/sharedFile/create", { title, description });
  return res.data;
};

export const _uploadFiles = async ({ folderId, data }) => {
  console.log(folderId);
  console.log(data);
  
  const res = await axios.post(`/sharedFile/${folderId}/upload`, {data});

  return res.data;
};

export const _addComment = async ({ folderId, content }) => {
  const res = await axios.post(`/sharedFile/${folderId}/comment`, {
    content,
  });
  return res.data;
};

export const _deleteFile = async ({ folderId, fileUrl }) => {
  const res = await axios.delete(`/sharedFile/${folderId}/file`, {
    data: { fileUrl },
  });
  return res.data;
};

export const _deleteFolder = async (folderId) => {
  const res = await axios.delete(`/sharedFile/${folderId}`);
  return res.data;
};

export const _deleteComment = async ({ folderId, commentId }) => {
  const res = await axios.delete(
    `/sharedFile/${folderId}/comment/${commentId}`
  );
  return res.data;
};

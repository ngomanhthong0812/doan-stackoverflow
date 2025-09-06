import axios from "@/config/axios";

export const _getComments = async ({
  parentType,
  parentId,
  page = 1,
  perPage = 20,
}) => {
  const response = await axios.get("/comments", {
    params: { parentType, parentId, page, perPage },
  });
  return response.data;
};

export const _createComments = async ({
  content,
  parentType,
  parentId,
  parentComment = null,
}) => {
  const response = await axios.post("/comments", {
    content,
    parentType,
    parentId,
    parentComment,
  });
  return response.data;
};

export const _toggleLike = async ({ commentId }) => {
  const response = await axios.post(`/comments/${commentId}/like`);
  return response.data;
};

export const _deleteComment = async ({ commentId }) => {
  const response = await axios.delete(`/comments/${commentId}`);
  return response.data;
};

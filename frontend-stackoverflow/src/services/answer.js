import axios from "@/config/axios";

export const _getAnswerByQuestionId = async ({ questionId }) => {
  const response = await axios.get(`/answers/${questionId}`);
  return response.data;
};

export const _createAnswer = async ({ content, questionId }) => {
  const res = await axios.post("/answers", { content, question: questionId });
  return res.data;
};

export const _updateAnswer = async ({ content, answerId }) => {
  const res = await axios.put(`/answers/${answerId}`, {
    content,
  });
  return res.data;
};

export const _toggleLike = async ({ answerId }) => {
  const response = await axios.post(`/answers/${answerId}/like`);
  return response.data;
};

export const _deleteAnswer = async ({ answerId }) => {
  const response = await axios.delete(`/answers/${answerId}`);
  return response.data;
};

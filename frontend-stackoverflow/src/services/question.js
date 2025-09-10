import axios from "@/config/axios";

export const _getQuestions = async ({
  page,
  perPage,
  noAnswers,
  sortedBy,
  search,
}) => {
  const response = await axios.get("/questions", {
    params: {
      page,
      perPage,
      noAnswers,
      sortedBy,
      search,
    },
  });
  return response.data;
};

export const _getQuestionsByTabs = async ({ page, perPage, selectedTags }) => {
  const response = await axios.get("/questions/by-tabs", {
    params: {
      page,
      perPage,
      selectedTags: JSON.stringify(selectedTags),
    },
  });
  return response.data;
};

export const _getQuestionById = async (id) => {
  const response = await axios.get(`/questions/${id}`);
  return response.data;
};

export const _createQuestions = async ({ title, content, tags, author }) => {
  const response = await axios.post("/questions", {
    title,
    content,
    tags,
    author,
  });
  return response.data;
};

export const _updateQuestion = async ({ questionId, title, content, tags }) => {
  const response = await axios.put(`/questions/${questionId}`, {
    title,
    content,
    tags,
  });
  return response.data;
};

export const _toggleUpvote = async ({ questionId }) => {
  const response = await axios.post(`/questions/${questionId}/upvote`);
  return response.data;
};

export const _getPendingEdits = async (id) => {
  const response = await axios.get(`/questionEdits/${id}/status`, {
    params: { status: "pending" },
  });
  return response.data;
};

export const _getEdits = async (id) => {
  const response = await axios.get(`/questionEdits/${id}/status`);
  return response.data;
};

export const _getQuestionEditById = async (editId) => {
  const response = await axios.get(`/questionEdits/${editId}`);
  return response.data;
};

export const _approveQuestionEdit = async (editId) => {
  const response = await axios.post(`/questionEdits/${editId}/approve`);
  return response.data;
};

export const _rejectQuestionEdit = async (editId) => {
  const response = await axios.post(`/questionEdits/${editId}/reject`);
  return response.data;
};

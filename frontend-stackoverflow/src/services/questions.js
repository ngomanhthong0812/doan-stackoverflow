import axios from "@/config/axios";

export const _getQuestions = async ({ page, perPage, noAnswers, sortedBy }) => {
  const response = await axios.get("/questions", {
    params: {
      page,
      perPage,
      noAnswers,
      sortedBy,
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

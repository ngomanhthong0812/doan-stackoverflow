import axios from "@/config/axios";

export const _getTags = async ({
  page = 1,
  perPage = 20,
  sortBy = "popular",
  search = "",
}) => {
  const response = await axios.get("/tags", {
    params: {
      page,
      perPage,
      sortBy,
      search,
    },
  });

  return response.data;
};

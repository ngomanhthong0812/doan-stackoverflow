import axios from "@/config/axios";

export const _getStats = async () => {
  const response = await axios.get("/stats");
  return response.data;
};

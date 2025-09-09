import axios from "@/config/axios";

export const _getNotificationByUserId = async (userId) => {
  const response = await axios.get(`/notifications/${userId}`);
  return response.data;
};

export const _createNotifications = async (data) => {
  const response = await axios.post("/notifications", data);
  return response.data;
};

export const _markAsRead = async (notificationId) => {
  const response = await axios.patch(`/notifications/read/${notificationId}`);
  return response.data;
};

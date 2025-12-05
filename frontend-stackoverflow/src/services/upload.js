import axios from "@/config/axios";
import { toast } from "sonner";

export const _upload = async (file) => {
  const toastId = toast.loading("Uploading...");

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Upload success", { id: toastId });
    return response.data;
  } catch (error) {
    toast.error("Upload failed", { id: toastId });
    throw error;
  }
};

export const _uploadMultiple = async (files) => {
  if (!files || files.length === 0) return [];
  const toastId = toast.loading(`Uploading ${files.length} file(s)...`);

  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await axios.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Upload success", { id: toastId });
    return response.data.files; // trả về mảng [{url, fileName}]
  } catch (error) {
    toast.error("Upload failed", { id: toastId });
    throw error;
  }
};

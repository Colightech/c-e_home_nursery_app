import axiosInstance from "../api/axiosInstance";


const uploadFile = async (file: any) => {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: file.fileName || "file",
    type: file.type,
  } as any);

  const res = await axiosInstance.post("/chat/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

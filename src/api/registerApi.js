import axios from "axios";

const API_URL = "https://641855f875be53f451dca0ae.mockapi.io/api/users";

export const registerApi = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Đăng ký không thành công");
  }
};

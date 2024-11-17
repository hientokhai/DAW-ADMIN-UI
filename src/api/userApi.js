import axios from "axios";

export const userApi = async () => {
  const response = await axios.get(
    "https://641855f875be53f451dca0ae.mockapi.io/api/users"
  );
  return response.data;
};

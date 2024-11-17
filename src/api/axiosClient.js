import axios from 'axios';
import queryString from 'query-string';

//Tạo một instance của axios với cấu hình mặc định.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //Thiết lập baseURL cho tất cả các yêu cầu, giá trị này được lấy từ biến môi trường REACT_APP_API_URL. Điều này giúp dễ dàng thay đổi URL API mà không cần chỉnh sửa nhiều nơi trong code.
  headers: {
    'content-type': 'application/json'
  },
  paramsSerializer: (params) => queryString.stringify(params) //Chuyển đổi các tham số trong params thành chuỗi query string bằng queryString.stringify. Điều này giúp đảm bảo rằng các tham số được format đúng cách khi thêm vào URL.
});

axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  return config;
});

//Thiết lập một interceptor để xử lý phản hồi khi nhận được từ server.
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);

export default axiosClient;

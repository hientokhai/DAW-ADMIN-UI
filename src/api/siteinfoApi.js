const SiteInfoApi = {
    // Lấy thông tin cửa hàng
    get: async () => {
      const url = 'http://127.0.0.1:8000/api/site-info'; // Thay URL này bằng endpoint API của bạn
      try {
        const response = await axiosClient.get(url);
        return response.data; // Trả về dữ liệu API
      } catch (error) {
        console.error('Error fetching site info:', error);
        throw error;
      }
    },
  
    // Cập nhật thông tin cửa hàng
    update: (id, data) => {
      const url = `http://127.0.0.1:8000/api/site-info/${id}`;
      return axiosClient.put(url, data);
    },
  };
  
  export default SiteInfoApi;
  
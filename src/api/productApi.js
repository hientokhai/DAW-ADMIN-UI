import axiosClient from './axiosClient';

const ProductApi = {
  getAll: (params) => {
    const url = 'http://127.0.0.1:8000/api/products/';
    return axiosClient.get(url, { params });
  },

  addProduct: async (newProduct) => {
    try {
      // Gửi yêu cầu thêm sản phẩm lên backend
      const response = await axios.post('http://127.0.0.1:8000/api/products', newProduct);
      return response;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  getColors: (params) => {
    const url = 'http://127.0.0.1:8000/api/colors/';
    return axiosClient.get(url, { params });
  },
  getCategories: (params) => {
    const url = 'http://127.0.0.1:8000/api/categories/';
    return axiosClient.get(url, { params });
  },
  getSizes: (params) => {
    const url = 'http://127.0.0.1:8000/api/sizes/';
    return axiosClient.get(url, { params });
  },
  create: async (newProduct) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products', newProduct);
      return response.data; // trả về dữ liệu sản phẩm sau khi thêm
    } catch (error) {
      throw error;
    }
  },
  getById: async (id) => {
    const url = `http://127.0.0.1:8000/api/products/${id}`;
    return axiosClient.get(url);
  },
  update: (id, data, config = {}) => {
    const url = `http://127.0.0.1:8000/api/products/${id}`;
    return axiosClient.put(url, data, config);
  }
};

export default ProductApi;

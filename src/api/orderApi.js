import axiosClient from './axiosClient';

const OrderApi = {
  getAll: (params) => {
    const url = 'http://127.0.0.1:8000/api/orders/';
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `https://641855f875be53f451dca0ae.mockapi.io/api/products/${id}`;
    return axiosClient.get(url);
  }
};

export default OrderApi;

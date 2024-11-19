import axiosClient from './axiosClient';

const OrderApi = {
  getAll: (params) => {
    const url = 'http://127.0.0.1:8000/api/orders/';
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `http://127.0.0.1:8000/api/orders/${id}`;
    return axiosClient.get(url);
  },
  updateStatus: (id, data) => {
    const url = `http://127.0.0.1:8000/api/orders/${id}/status`;
    return axiosClient.put(url, data);
  }
};

export default OrderApi;

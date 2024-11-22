import axiosClient from './axiosClient';

const CustomerApi = {
  getAll: (params) => {
    const url = 'http://127.0.0.1:8000/api/users/';
    return axiosClient.get(url, { params });
  },
};

export default CustomerApi;

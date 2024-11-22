import axiosClient from './axiosClient';

const StatisticApi = {
  getAll: (params) => {
    const url = 'http://127.0.0.1:8000/api/statitics';
    return axiosClient.get(url, { params });
  }
};

export default StatisticApi;

import axiosClient from './axiosClient';

const CommentApi = {
  getAll: (params) => {
    const url = 'http://127.0.0.1:8000/api/comments';
    return axiosClient.get(url, { params });
  },
  delete: (id) => {
    const url = `http://127.0.0.1:8000/api/comments/${id}`;
    return axiosClient.delete(url);
  }
};

export default CommentApi;

import axiosClient from './axiosClient';

const CommentApi = {
  getAll: (param) => {
    const url = `http://127.0.0.1:8000/api/comments`;
    return axiosClient.get(url, { param });
  },
  delete: (id) => {
    const url = `http://127.0.0.1:8000/api/comments/${id}`;
    return axiosClient.get(url);
  }
};

export default CommentApi;

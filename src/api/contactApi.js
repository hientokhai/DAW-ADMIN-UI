import axiosClient from './axiosClient';

const ContactApi = {
  getAll: (params) => {
    const url = 'http://127.0.0.1:8000/api/contacts/'; // Thay URL này bằng endpoint API của bạn
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `http://127.0.0.1:8000/api/contacts/${id}`; // Endpoint lấy thông tin liên hệ theo ID
    return axiosClient.get(url);
  },
  create: (data) => {
    const url = 'http://127.0.0.1:8000/api/contacts/'; // Endpoint để tạo liên hệ mới
    return axiosClient.post(url, data);
  },
  update: (id, data) => {
    const url = `http://127.0.0.1:8000/api/contacts/${id}`; // Endpoint để cập nhật liên hệ
    return axiosClient.put(url, data);
  },
  delete: (id) => {
    const url = `http://127.0.0.1:8000/api/contacts/${id}`; // Endpoint để xóa liên hệ
    return axiosClient.delete(url);
  }
};

export default ContactApi;

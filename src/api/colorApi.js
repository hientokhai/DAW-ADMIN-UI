import axiosClient from './axiosClient';

const ColorApi = {
    // Lấy tất cả danh mục
    getAll: (params) => {
        const url = 'http://127.0.0.1:8000/api/colors/';
        return axiosClient.get(url, { params });
    },

    // Lấy danh mục theo ID
    get: (id) => {
        const url = `http://127.0.0.1:8000/api/colors/show/${id}`; // Sửa URL cho đúng
        return axiosClient.get(url);
    },

    // Tạo danh mục mới
    create: (data) => {
        const url = 'http://127.0.0.1:8000/api/colors/store';
        return axiosClient.post(url, data);
    },

    // Cập nhật danh mục
    update: (id, data) => {
        const url = `http://127.0.0.1:8000/api/colors/update/${id}`;
        return axiosClient.put(url, data);
    },

    // Xóa danh mục
    delete: (id) => {
        const url = `http://127.0.0.1:8000/api/colors/destroy/${id}`;
        return axiosClient.delete(url);
    },

    // Tìm kiếm danh mục
    search: (query) => {
        const url = 'http://127.0.0.1:8000/api/colors/search';
        return axiosClient.get(url, { params: { query } });
    }
};

export default ColorApi;

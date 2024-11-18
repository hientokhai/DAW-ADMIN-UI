import axiosClient from './axiosClient';

const CategoryApi = {
    // Lấy tất cả danh mục
    getAll: (params) => {
        const url = 'http://127.0.0.1:8000/api/categories/';
        return axiosClient.get(url, { params });
    },

    // Lấy danh mục theo ID
    get: (id) => {
        const url = `http://127.0.0.1:8000/api/categories/show/${id}`; // Sửa URL cho đúng
        return axiosClient.get(url);
    },

    // Tạo danh mục mới
    create: (data) => {
        const url = 'http://127.0.0.1:8000/api/categories/store';
        return axiosClient.post(url, data);
    },

    // Cập nhật danh mục
    update: (id, data) => {
        const url = `http://127.0.0.1:8000/api/categories/update/${id}`;
        return axiosClient.put(url, data);
    },

    // Xóa danh mục
    delete: (id) => {
        const url = `http://127.0.0.1:8000/api/categories/destroy/${id}`;
        return axiosClient.delete(url);
    },

    // Tìm kiếm danh mục
    search: (query) => {
        const url = 'http://127.0.0.1:8000/api/categories/search';
        return axiosClient.get(url, { params: { query } });
    }
};

export default CategoryApi;

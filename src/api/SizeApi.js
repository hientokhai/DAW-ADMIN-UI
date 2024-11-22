import axiosClient from './axiosClient';

const SizeApi = {

    // Lấy tất cả kích thước 
    getAll: (params) => {
        const url = 'http://127.0.0.1:8000/api/sizes/';
        return axiosClient.get(url, { params });
    },


    // Tạo kích thước mới
    store: (data) => {
        const url = 'http://127.0.0.1:8000/api/sizes/store/';
        return axiosClient.post(url, data);
    },

    // Cập nhật kích thước
    update: (id, data) => {
        const url = `http://127.0.0.1:8000/api/sizes/update/${id}`;
        return axiosClient.put(url, data);
    },

    // Xóa kích thước
    destroy: (id) => {
        const url = `http://127.0.0.1:8000/api/sizes/destroy/${id}`;
        return axiosClient.delete(url);
    },


};

export default SizeApi;
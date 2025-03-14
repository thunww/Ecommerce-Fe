import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const productApi = {
    getAllProducts: () => axios.get(`${API_BASE_URL}/products`),
    getProductById: (id) => axios.get(`${API_BASE_URL}/products/${id}`),
    createProduct: (data) => axios.post(`${API_BASE_URL}/products`, data),
    updateProduct: (id, data) => axios.put(`${API_BASE_URL}/products/${id}`, data),
    deleteProduct: (id) => axios.delete(`${API_BASE_URL}/products/${id}`)
};

export default productApi;

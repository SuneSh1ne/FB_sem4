import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const api = {
    getProducts: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const url = params ? `/products?${params}` : '/products';
        const response = await apiClient.get(url);
        return response.data;
    },

    getProductById: async (id) => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (product) => {
        const response = await apiClient.post('/products', product);
        return response.data;
    },

    updateProduct: async (id, product) => {
        const response = await apiClient.put(`/products/${id}`, product);
        return response.data;
    },

    patchProduct: async (id, product) => {
        const response = await apiClient.patch(`/products/${id}`, product);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    },

    getStats: async () => {
        const response = await apiClient.get('/stats');
        return response.data;
    }
};
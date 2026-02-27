import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('Timeout error:', error);
            throw new Error('Сервер не отвечает. Проверьте подключение.');
        }
        
        if (error.response) {
            console.error('API Error:', error.response.data);
            throw error.response.data;
        } else if (error.request) {
            console.error('No response:', error.request);
            throw new Error('Сервер не доступен');
        } else {
            console.error('Request error:', error.message);
            throw error;
        }
    }
);

export const api = {
    getProducts: async (filters = {}) => {
        const params = new URLSearchParams();
        
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.inStock) params.append('inStock', 'true');
        if (filters.sort) params.append('sort', filters.sort);
        
        const url = params.toString() ? `/products?${params.toString()}` : '/products';
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
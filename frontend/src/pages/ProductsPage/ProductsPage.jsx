import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import ProductList from '../../components/ProductList';
import ProductForm from '../../components/ProductForm';
import './ProductsPage.scss';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingProduct, setEditingProduct] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        sort: ''
    });
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadProducts();
    }, [filters]);

    useEffect(() => {
        loadStats();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const activeFilters = {};
            if (filters.category) activeFilters.category = filters.category;
            if (filters.minPrice) activeFilters.minPrice = filters.minPrice;
            if (filters.maxPrice) activeFilters.maxPrice = filters.maxPrice;
            if (filters.inStock) activeFilters.inStock = 'true';
            if (filters.sort) activeFilters.sort = filters.sort;
            
            const response = await api.getProducts(activeFilters);
            setProducts(response.data);
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Ошибка при загрузке товаров');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await api.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setEditingProduct(null);
        setModalOpen(true);
    };

    const openEditModal = (product) => {
        setModalMode('edit');
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            return;
        }
        
        try {
            await api.deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            loadStats();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Ошибка при удалении товара');
        }
    };

    const handleSubmit = async (productData) => {
        try {
            if (modalMode === 'create') {
                const response = await api.createProduct(productData);
                setProducts(prev => [...prev, response.data]);
            } else {
                const response = await api.updateProduct(productData.id, productData);
                setProducts(prev => prev.map(p => 
                    p.id === productData.id ? response.data : p
                ));
            }
            closeModal();
            loadStats();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Ошибка при сохранении товара');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            inStock: false,
            sort: ''
        });
    };

    return (
        <div className="products-page">
            <header className="header">
                <div className="container">
                    <div className="header__inner">
                        <div className="brand">🛍️ Дикие ягодки</div>
                        <div className="header__stats">
                            {stats && (
                                <>
                                    <span>Товаров: {stats.totalProducts}</span>
                                    <span>На складе: {stats.totalStock} шт.</span>
                                    <span>Средняя цена: {stats.averagePrice} ₽</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="page-title">Каталог товаров</h1>
                        <button className="btn btn--primary" onClick={openCreateModal}>
                            + Добавить товар
                        </button>
                    </div>
                    
                    <div className="filters">
                        <div className="filters__row">
                            <input
                                type="text"
                                name="category"
                                className="filter-input"
                                placeholder="Категория"
                                value={filters.category}
                                onChange={handleFilterChange}
                            />
                            
                            <input
                                type="number"
                                name="minPrice"
                                className="filter-input"
                                placeholder="Цена от"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                min="0"
                            />
                            
                            <input
                                type="number"
                                name="maxPrice"
                                className="filter-input"
                                placeholder="Цена до"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                min="0"
                            />
                            
                            <select
                                name="sort"
                                className="filter-input"
                                value={filters.sort}
                                onChange={handleFilterChange}
                            >
                                <option value="">Сортировка</option>
                                <option value="price_asc">Цена (по возрастанию)</option>
                                <option value="price_desc">Цена (по убыванию)</option>
                                <option value="rating">По рейтингу</option>
                                <option value="name">По названию</option>
                            </select>
                            
                            <label className="filter-checkbox">
                                <input
                                    type="checkbox"
                                    name="inStock"
                                    checked={filters.inStock}
                                    onChange={handleFilterChange}
                                />
                                Только в наличии
                            </label>
                            
                            <button className="btn btn--secondary" onClick={clearFilters}>
                                Сбросить
                            </button>
                        </div>
                    </div>
                    
                    <ProductList
                        products={products}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                        loading={loading}
                    />
                </div>
            </main>
            
            <footer className="footer">
                <div className="container">
                    <div className="footer__inner">
                        <div>© {new Date().getFullYear()} Дикие ягодки. Все права защищены.</div>
                        <div>React + Express</div>
                    </div>
                </div>
            </footer>
            
            <ProductForm
                open={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                onClose={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
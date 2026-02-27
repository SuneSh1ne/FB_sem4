import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onEdit, onDelete, loading }) {
    if (loading) {
        return <div className="loading">Загрузка товаров...</div>;
    }

    if (!products.length) {
        return (
            <div className="empty">
                <p>Товары не найдены</p>
                <p className="empty__hint">Создайте первый товар или измените параметры фильтрации</p>
            </div>
        );
    }

    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
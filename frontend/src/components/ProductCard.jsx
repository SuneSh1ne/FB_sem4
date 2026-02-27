import React from 'react';

export default function ProductCard({ product, onEdit, onDelete }) {
    return (
        <div className="product-card">
            <div className="product-card__image">
                <img src={product.image} alt={product.name} />
                {product.stock === 0 && (
                    <span className="product-card__badge">Нет в наличии</span>
                )}
                {product.stock > 0 && product.stock < 3 && (
                    <span className="product-card__badge product-card__badge--warning">
                        Осталось {product.stock} шт.
                    </span>
                )}
            </div>
            
            <div className="product-card__content">
                <div className="product-card__category">{product.category}</div>
                <h3 className="product-card__title">{product.name}</h3>
                <p className="product-card__description">{product.description}</p>
                
                <div className="product-card__rating">
                    {'★'.repeat(Math.floor(product.rating))}
                    {'☆'.repeat(5 - Math.floor(product.rating))}
                    <span className="product-card__rating-value">{product.rating}</span>
                </div>
                
                <div className="product-card__footer">
                    <div className="product-card__price">
                        {product.price.toLocaleString()} ₽
                    </div>
                    <div className="product-card__stock">
                        В наличии: {product.stock} шт.
                    </div>
                </div>
                
                <div className="product-card__actions">
                    <button 
                        className="btn btn--edit"
                        onClick={() => onEdit(product)}
                    >
                        ✎ Редактировать
                    </button>
                    <button 
                        className="btn btn--delete"
                        onClick={() => onDelete(product.id)}
                    >
                        ✕ Удалить
                    </button>
                </div>
            </div>
        </div>
    );
}
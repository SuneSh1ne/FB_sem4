import React, { useState, useEffect } from 'react';

export default function ProductForm({ open, mode, initialProduct, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        stock: '',
        rating: '',
        image: ''
    });
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open && initialProduct) {
            setFormData({
                name: initialProduct.name || '',
                category: initialProduct.category || '',
                description: initialProduct.description || '',
                price: String(initialProduct.price || ''),
                stock: String(initialProduct.stock || ''),
                rating: String(initialProduct.rating || ''),
                image: initialProduct.image || ''
            });
        } else if (open) {
            setFormData({
                name: '',
                category: '',
                description: '',
                price: '',
                stock: '',
                rating: '',
                image: ''
            });
        }
        setErrors({});
    }, [open, initialProduct]);

    if (!open) return null;

    const title = mode === 'edit' ? 'Редактирование товара' : 'Добавление нового товара';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Введите название товара';
        }
        
        if (!formData.category.trim()) {
            newErrors.category = 'Введите категорию';
        }
        
        if (!formData.description.trim()) {
            newErrors.description = 'Введите описание';
        }
        
        const price = Number(formData.price);
        if (!formData.price || isNaN(price) || price <= 0) {
            newErrors.price = 'Введите корректную цену';
        }
        
        const stock = Number(formData.stock);
        if (!formData.stock || isNaN(stock) || stock < 0) {
            newErrors.stock = 'Введите корректное количество';
        }
        
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        onSubmit({
            id: initialProduct?.id,
            name: formData.name.trim(),
            category: formData.category.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            stock: Number(formData.stock),
            rating: Number(formData.rating) || 0,
            image: formData.image || "https://via.placeholder.com/300x200?text=Product"
        });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <h2 className="modal__title">{title}</h2>
                    <button className="modal__close" onClick={onClose}>✕</button>
                </div>
                
                <form className="modal__form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Название товара *</label>
                        <input
                            type="text"
                            name="name"
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Например, iPhone 15 Pro Max"
                            autoFocus
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Категория *</label>
                        <input
                            type="text"
                            name="category"
                            className={`form-input ${errors.category ? 'error' : ''}`}
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Например, Смартфоны"
                        />
                        {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Описание *</label>
                        <textarea
                            name="description"
                            className={`form-input ${errors.description ? 'error' : ''}`}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Подробное описание товара"
                            rows="3"
                        />
                        {errors.description && <span className="error-message">{errors.description}</span>}
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Цена (₽) *</label>
                            <input
                                type="number"
                                name="price"
                                className={`form-input ${errors.price ? 'error' : ''}`}
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="249990"
                                min="0"
                                step="1"
                            />
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Количество *</label>
                            <input
                                type="number"
                                name="stock"
                                className={`form-input ${errors.stock ? 'error' : ''}`}
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="10"
                                min="0"
                                step="1"
                            />
                            {errors.stock && <span className="error-message">{errors.stock}</span>}
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Рейтинг (0-5)</label>
                            <input
                                type="number"
                                name="rating"
                                className="form-input"
                                value={formData.rating}
                                onChange={handleChange}
                                placeholder="4.5"
                                min="0"
                                max="5"
                                step="0.1"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">URL изображения</label>
                            <input
                                type="url"
                                name="image"
                                className="form-input"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                    
                    <div className="modal__footer">
                        <button type="button" className="btn btn--secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === 'edit' ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
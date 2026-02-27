const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

let products = [
    {
        id: nanoid(8),
        name: "MacBook Pro 16 M3",
        category: "Ноутбуки",
        description: "Apple M3 Pro, 18 ГБ RAM, 512 ГБ SSD, 16″ Liquid Retina XDR",
        price: 249990,
        stock: 5,
        rating: 4.9,
        image: "https://via.placeholder.com/300x200?text=MacBook+Pro"
    },
    {
        id: nanoid(8),
        name: "iPhone 15 Pro Max",
        category: "Смартфоны",
        description: "A17 Pro, 256 ГБ, титановый корпус, основная камера 48 МП",
        price: 149990,
        stock: 12,
        rating: 4.8,
        image: "https://via.placeholder.com/300x200?text=iPhone+15"
    },
    {
        id: nanoid(8),
        name: "Samsung Galaxy S24 Ultra",
        category: "Смартфоны",
        description: "Snapdragon 8 Gen 3, 12 ГБ RAM, 512 ГБ, 200 МП камера",
        price: 139990,
        stock: 8,
        rating: 4.7,
        image: "https://via.placeholder.com/300x200?text=Galaxy+S24"
    },
    {
        id: nanoid(8),
        name: "iPad Pro 12.9",
        category: "Планшеты",
        description: "M2, 256 ГБ, Liquid Retina XDR, поддержка Apple Pencil",
        price: 119990,
        stock: 6,
        rating: 4.9,
        image: "https://via.placeholder.com/300x200?text=iPad+Pro"
    },
    {
        id: nanoid(8),
        name: "Sony WH-1000XM5",
        category: "Аудио",
        description: "Беспроводные наушники с шумоподавлением, 30 часов работы",
        price: 29990,
        stock: 15,
        rating: 4.9,
        image: "https://via.placeholder.com/300x200?text=Sony+WH-1000XM5"
    },
    {
        id: nanoid(8),
        name: "Apple Watch Series 9",
        category: "Умные часы",
        description: "GPS, 45 мм, Always-On Retina, S9 SiP",
        price: 44990,
        stock: 10,
        rating: 4.8,
        image: "https://via.placeholder.com/300x200?text=Apple+Watch"
    },
    {
        id: nanoid(8),
        name: "MacBook Air 13 M2",
        category: "Ноутбуки",
        description: "Apple M2, 8 ГБ RAM, 256 ГБ SSD, Midnight",
        price: 129990,
        stock: 7,
        rating: 4.7,
        image: "https://via.placeholder.com/300x200?text=MacBook+Air"
    },
    {
        id: nanoid(8),
        name: "AirPods Pro 2",
        category: "Аудио",
        description: "Активное шумоподавление, USB-C зарядка, адаптивный эквалайзер",
        price: 24990,
        stock: 20,
        rating: 4.9,
        image: "https://via.placeholder.com/300x200?text=AirPods+Pro"
    },
    {
        id: nanoid(8),
        name: "Logitech MX Master 3S",
        category: "Аксессуары",
        description: "Беспроводная мышь, 8000 DPI, тихие клики, горизонтальная прокрутка",
        price: 8990,
        stock: 25,
        rating: 4.8,
        image: "https://via.placeholder.com/300x200?text=MX+Master+3S"
    },
    {
        id: nanoid(8),
        name: "Keychron K2 Pro",
        category: "Аксессуары",
        description: "Механическая клавиатура, Hot-swappable, RGB подсветка",
        price: 12990,
        stock: 12,
        rating: 4.7,
        image: "https://via.placeholder.com/300x200?text=Keychron+K2"
    }
];

app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${res.statusCode} ${req.path} - ${duration}ms`);
        
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('  Body:', req.body);
        }
    });
    
    next();
});

function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ 
            success: false, 
            error: "Product not found" 
        });
        return null;
    }
    return product;
}

function validateProduct(product, isPartial = false) {
    const errors = [];
    
    if (!isPartial || product.name !== undefined) {
        if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
            errors.push('Название товара обязательно');
        }
    }
    
    if (!isPartial || product.category !== undefined) {
        if (!product.category || typeof product.category !== 'string') {
            errors.push('Категория товара обязательна');
        }
    }
    
    if (!isPartial || product.description !== undefined) {
        if (!product.description || typeof product.description !== 'string') {
            errors.push('Описание товара обязательно');
        }
    }
    
    if (!isPartial || product.price !== undefined) {
        if (product.price === undefined || typeof product.price !== 'number' || product.price <= 0) {
            errors.push('Цена должна быть положительным числом');
        }
    }
    
    if (!isPartial || product.stock !== undefined) {
        if (product.stock === undefined || typeof product.stock !== 'number' || product.stock < 0) {
            errors.push('Количество на складе должно быть неотрицательным числом');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Дикие ягодки API',
        endpoints: {
            products: {
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:id',
                create: 'POST /api/products',
                update: 'PUT /api/products/:id',
                patch: 'PATCH /api/products/:id',
                delete: 'DELETE /api/products/:id'
            },
            stats: 'GET /api/stats'
        }
    });
});

app.get('/api/products', (req, res) => {
    const { category, minPrice, maxPrice, inStock, sort } = req.query;
    
    let filteredProducts = [...products];
    
    if (category) {
        filteredProducts = filteredProducts.filter(p => 
            p.category.toLowerCase().includes(category.toLowerCase())
        );
    }
    
     if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
    }
    
    if (inStock === 'true') {
        filteredProducts = filteredProducts.filter(p => p.stock > 0);
    }
    
    if (sort) {
        switch(sort) {
            case 'price_asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }
    
    res.json({
        success: true,
        count: filteredProducts.length,
        data: filteredProducts
    });
});

app.get('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    
    res.json({
        success: true,
        data: product
    });
});

app.post('/api/products', (req, res) => {
    const validation = validateProduct(req.body);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            errors: validation.errors
        });
    }
    
    const newProduct = {
        id: nanoid(8),
        name: req.body.name.trim(),
        category: req.body.category,
        description: req.body.description,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        rating: req.body.rating || 0,
        image: req.body.image || "https://via.placeholder.com/300x200?text=New+Product"
    };
    
    products.push(newProduct);
    
    res.status(201).json({
        success: true,
        message: 'Товар успешно создан',
        data: newProduct
    });
});

app.put('/api/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            error: "Product not found"
        });
    }
    
    const validation = validateProduct(req.body);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            errors: validation.errors
        });
    }
    
    products[productIndex] = {
        id: req.params.id,
        name: req.body.name.trim(),
        category: req.body.category,
        description: req.body.description,
        price: Number(req.body.price),
        stock: Number(req.body.stock),
        rating: req.body.rating || products[productIndex].rating,
        image: req.body.image || products[productIndex].image
    };
    
    res.json({
        success: true,
        message: 'Товар полностью обновлен',
        data: products[productIndex]
    });
});

app.patch('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            error: "Nothing to update"
        });
    }

    const validation = validateProduct(req.body, true);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            errors: validation.errors
        });
    }
    
    if (req.body.name !== undefined) product.name = req.body.name.trim();
    if (req.body.category !== undefined) product.category = req.body.category;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
    if (req.body.rating !== undefined) product.rating = req.body.rating;
    if (req.body.image !== undefined) product.image = req.body.image;
    
    res.json({
        success: true,
        message: 'Товар обновлен',
        data: product
    });
});

app.delete('/api/products/:id', (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    
    if (!exists) {
        return res.status(404).json({
            success: false,
            error: "Product not found"
        });
    }
    
    products = products.filter(p => p.id !== req.params.id);
    
    res.status(204).send();
});

app.get('/api/stats', (req, res) => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
    const categories = [...new Set(products.map(p => p.category))];
    const cheapestProduct = products.reduce((min, p) => p.price < min.price ? p : min, products[0]);
    const mostExpensiveProduct = products.reduce((max, p) => p.price > max.price ? p : max, products[0]);
    
    res.json({
        success: true,
        data: {
            totalProducts,
            totalStock,
            averagePrice: Math.round(averagePrice),
            categories,
            cheapestProduct: {
                name: cheapestProduct.name,
                price: cheapestProduct.price
            },
            mostExpensiveProduct: {
                name: mostExpensiveProduct.name,
                price: mostExpensiveProduct.price
            }
        }
    });
});


// 404 для несуществующих маршрутов
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found"
    });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        error: "Internal server error"
    });
});

app.listen(port, () => {
    console.log(`
    ========================================
    Сервер Диких ягодок запущен!
    Адрес: http://localhost:${port}
    
    Доступные endpoints:
    - GET    /api/products
    - GET    /api/products/:id
    - POST   /api/products
    - PUT    /api/products/:id
    - PATCH  /api/products/:id
    - DELETE /api/products/:id
    - GET    /api/stats
    
    Товаров в базе: ${products.length}
    ========================================
    `);
});
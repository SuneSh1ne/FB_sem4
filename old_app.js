const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

let products = [
    { 
        id: 1, 
        name: 'Ноутбук ASUS ROG', 
        price: 89990 
    },
    { 
        id: 2, 
        name: 'Смартфон Samsung Galaxy S23', 
        price: 74990 
    },
    { 
        id: 3, 
        name: 'Наушники Sony WH-1000XM5', 
        price: 29990 
    },
    { 
        id: 4, 
        name: 'Клавиатура механическая Logitech', 
        price: 8990 
    },
    { 
        id: 5, 
        name: 'Монитор Dell 27"', 
        price: 34990 
    }
];

function validateProduct(product) {
    const errors = [];
    
    if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
        errors.push('Название товара обязательно и должно быть строкой');
    } else if (product.name.length < 2) {
        errors.push('Название товара должно содержать минимум 2 символа');
    } else if (product.name.length > 100) {
        errors.push('Название товара не должно превышать 100 символов');
    }
    
    if (product.price === undefined || product.price === null) {
        errors.push('Цена товара обязательна');
    } else if (typeof product.price !== 'number') {
        errors.push('Цена должна быть числом');
    } else if (product.price <= 0) {
        errors.push('Цена должна быть положительным числом');
    } else if (product.price > 10000000) {
        errors.push('Цена не может превышать 10 000 000');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

app.get('/', (req, res) => {
    res.send(`
        <h1>Product API</h1>
        <p>Доступные endpoints:</p>
        <ul>
            <li><strong>GET /products</strong> - получить все товары</li>
            <li><strong>GET /products/:id</strong> - получить товар по ID</li>
            <li><strong>POST /products</strong> - создать новый товар</li>
            <li><strong>PUT /products/:id</strong> - полностью обновить товар</li>
            <li><strong>PATCH /products/:id</strong> - частично обновить товар</li>
            <li><strong>DELETE /products/:id</strong> - удалить товар</li>
        </ul>
        <p>Пример JSON для создания товара:</p>
        <pre>{
    "name": "Название товара",
    "price": 123456
}</pre>
    `);
});

app.get('/products', (req, res) => {
    const { minPrice, maxPrice } = req.query;
    
    let filteredProducts = [...products];
    
    if (minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
    }
    
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
    }
    
    res.json({
        success: true,
        count: filteredProducts.length,
        data: filteredProducts
    });
});

app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID должен быть числом'
        });
    }
    
    const product = products.find(p => p.id === id);
    
    if (!product) {
        return res.status(404).json({
            success: false,
            message: `Товар с ID ${id} не найден`
        });
    }
    
    res.json({
        success: true,
        data: product
    });
});

app.post('/products', (req, res) => {
    const newProduct = req.body;
    
    const validation = validateProduct(newProduct);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            errors: validation.errors
        });
    }
    
    const newId = products.length > 0 
        ? Math.max(...products.map(p => p.id)) + 1 
        : 1;
    
    const productToAdd = {
        id: newId,
        name: newProduct.name.trim(),
        price: newProduct.price
    };
    
    products.push(productToAdd);
    
    res.status(201).json({
        success: true,
        message: 'Товар успешно создан',
        data: productToAdd
    });
});

app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID должен быть числом'
        });
    }
    
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: `Товар с ID ${id} не найден`
        });
    }
    
    const updatedProduct = req.body;
    
    const validation = validateProduct(updatedProduct);
    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            errors: validation.errors
        });
    }

    products[productIndex] = {
        id: id,
        name: updatedProduct.name.trim(),
        price: updatedProduct.price
    };
    
    res.json({
        success: true,
        message: 'Товар полностью обновлен',
        data: products[productIndex]
    });
});

app.patch('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID должен быть числом'
        });
    }
    
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: `Товар с ID ${id} не найден`
        });
    }
    
    const updates = req.body;

    if (updates.name !== undefined) {
        if (typeof updates.name !== 'string' || updates.name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Название товара должно быть непустой строкой'
            });
        }
        products[productIndex].name = updates.name.trim();
    }
    
    if (updates.price !== undefined) {
        if (typeof updates.price !== 'number' || updates.price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Цена должна быть положительным числом'
            });
        }
        products[productIndex].price = updates.price;
    }
    
    res.json({
        success: true,
        message: 'Товар частично обновлен',
        data: products[productIndex]
    });
});

app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID должен быть числом'
        });
    }
    
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: `Товар с ID ${id} не найден`
        });
    }

    const deletedProduct = products[productIndex];
    products = products.filter(p => p.id !== id);
    
    res.json({
        success: true,
        message: 'Товар успешно удален',
        data: deletedProduct
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Маршрут не найден'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Внутренняя ошибка сервера'
    });
});

app.listen(port, () => {
    console.log(`
    Сервер успешно запущен!
    Адрес: http://localhost:${port}
    
    Доступные endpoints:
    - GET    : http://localhost:${port}/products
    - GET    : http://localhost:${port}/products/:id
    - POST   : http://localhost:${port}/products
    - PUT    : http://localhost:${port}/products/:id
    - PATCH  : http://localhost:${port}/products/:id
    - DELETE : http://localhost:${port}/products/:id
    `);
});
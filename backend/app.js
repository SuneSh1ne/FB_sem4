const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         id:
 *           type: string
 *           description: Автоматически сгенерированный уникальный ID товара
 *           example: "abc123xyz"
 *         name:
 *           type: string
 *           description: Название товара
 *           example: "MacBook Pro 16 M3"
 *         category:
 *           type: string
 *           description: Категория товара
 *           example: "Ноутбуки"
 *         description:
 *           type: string
 *           description: Подробное описание товара
 *           example: "Apple M3 Pro, 18 ГБ RAM, 512 ГБ SSD, 16″ Liquid Retina XDR"
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *           example: 249990
 *         stock:
 *           type: integer
 *           description: Количество товара на складе
 *           example: 5
 *         rating:
 *           type: number
 *           description: Рейтинг товара (0-5)
 *           example: 4.9
 *         image:
 *           type: string
 *           description: URL изображения товара
 *           example: "/images/products/macbook-pro.jpg"
 *     
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           example: "Product not found"
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *         message:
 *           type: string
 *           example: "Товар успешно создан"
 *   
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 * 
 * tags:
 *   - name: Products
 *     description: Управление товарами интернет-магазина
 *   - name: Stats
 *     description: Статистика магазина
 */

/**
 * @swagger
 * info:
 *   title: API Интернет-магазина
 *   version: 1.0.0
 *   description: |
 *     Полноценное REST API для управления товарами интернет-магазина.
 *     
 *     ## Возможности
 *     * Получение списка товаров с фильтрацией и сортировкой
 *     * Получение товара по ID
 *     * Создание нового товара
 *     * Обновление товара (полное и частичное)
 *     * Удаление товара
 *     * Статистика магазина
 *     
 *   contact:
 *     name: Поддержка API
 *     email: support@example.com
 *   license:
 *     name: MIT
 *     url: https://opensource.org/licenses/MIT
 * 
 * servers:
 *   - url: http://localhost:3000
 *     description: Локальный сервер разработки
 *   - url: https://api.example.com
 *     description: Продакшн сервер
 */

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Интернет-магазина',
            version: '1.0.0',
            description: 'Полноценное REST API для управления товарами интернет-магазина',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Интернет-магазина - Документация',
    customfavIcon: 'https://swagger.io/favicon.ico',
}));

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

let products = [
    {
        id: nanoid(8),
        name: "MacBook Pro 16 M3",
        category: "Ноутбуки",
        description: "Apple M3 Pro, 18 ГБ RAM, 512 ГБ SSD, 16″ Liquid Retina XDR",
        price: 249990,
        stock: 5,
        rating: 4.9,
        image: "/images/products/macbook-pro.jpg"
    },
    {
        id: nanoid(8),
        name: "iPhone 15 Pro Max",
        category: "Смартфоны",
        description: "A17 Pro, 256 ГБ, титановый корпус, основная камера 48 МП",
        price: 149990,
        stock: 12,
        rating: 4.8,
        image: "/images/products/iphone-15.jpg"
    },
    {
        id: nanoid(8),
        name: "Samsung Galaxy S24 Ultra",
        category: "Смартфоны",
        description: "Snapdragon 8 Gen 3, 12 ГБ RAM, 512 ГБ, 200 МП камера",
        price: 139990,
        stock: 8,
        rating: 4.7,
        image: "/images/products/galaxy-s24.jpg"
    },
    {
        id: nanoid(8),
        name: "iPad Pro 12.9",
        category: "Планшеты",
        description: "M2, 256 ГБ, Liquid Retina XDR, поддержка Apple Pencil",
        price: 119990,
        stock: 6,
        rating: 4.9,
        image: "/images/products/ipad-pro.jpg"
    },
    {
        id: nanoid(8),
        name: "Sony WH-1000XM5",
        category: "Аудио",
        description: "Беспроводные наушники с шумоподавлением, 30 часов работы",
        price: 29990,
        stock: 15,
        rating: 4.9,
        image: "/images/products/sony-wh.jpg"
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

function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ 
            success: false, 
            error: "Товар не найден" 
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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Корневой эндпоинт API
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: Информация о доступных эндпоинтах
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: API Интернет-магазина
 *               endpoints:
 *                 products:
 *                   getAll: GET /api/products
 *                   getById: GET /api/products/:id
 *                   create: POST /api/products
 *                   update: PUT /api/products/:id
 *                   patch: PATCH /api/products/:id
 *                   delete: DELETE /api/products/:id
 *                 stats: GET /api/stats
 *                 docs: GET /api-docs
 */
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Диких ягодок',
        endpoints: {
            products: {
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:id',
                create: 'POST /api/products',
                update: 'PUT /api/products/:id',
                patch: 'PATCH /api/products/:id',
                delete: 'DELETE /api/products/:id'
            },
            stats: 'GET /api/stats',
            docs: 'GET /api-docs'
        }
    });
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список всех товаров
 *     description: Возвращает список товаров с возможностью фильтрации и сортировки
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Фильтр по категории товара
 *         example: "Ноутбуки"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Минимальная цена
 *         example: 10000
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Максимальная цена
 *         example: 50000
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Только товары в наличии
 *         example: true
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, rating, name]
 *         description: |
 *           Сортировка товаров:
 *           * `price_asc` - по возрастанию цены
 *           * `price_desc` - по убыванию цены
 *           * `rating` - по рейтингу
 *           * `name` - по названию
 *         example: "price_asc"
 *     responses:
 *       200:
 *         description: Успешный ответ со списком товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/products", (req, res) => {
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

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     description: Возвращает детальную информацию о конкретном товаре
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Уникальный идентификатор товара
 *         example: "abc123xyz"
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    
    res.json({
        success: true,
        data: product
    });
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать новый товар
 *     description: Добавляет новый товар в каталог
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 description: Название товара
 *                 example: "Новый товар"
 *               category:
 *                 type: string
 *                 description: Категория товара
 *                 example: "Электроника"
 *               description:
 *                 type: string
 *                 description: Описание товара
 *                 example: "Подробное описание нового товара"
 *               price:
 *                 type: number
 *                 description: Цена товара
 *                 example: 9990
 *               stock:
 *                 type: integer
 *                 description: Количество на складе
 *                 example: 10
 *               rating:
 *                 type: number
 *                 description: Рейтинг (опционально)
 *                 example: 4.5
 *               image:
 *                 type: string
 *                 description: URL изображения (опционально)
 *                 example: "/images/products/new-product.jpg"
 *     responses:
 *       201:
 *         description: Товар успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.post("/api/products", (req, res) => {
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
        image: req.body.image || "/images/products/default.jpg"
    };
    
    products.push(newProduct);
    
    res.status(201).json({
        success: true,
        message: 'Товар успешно создан',
        data: newProduct
    });
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Полностью обновить товар
 *     description: Заменяет все поля товара новыми данными
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Товар обновлен
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Товар не найден
 */
app.put("/api/products/:id", (req, res) => {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            error: "Товар не найден"
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

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Частично обновить товар
 *     description: Обновляет только указанные поля товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               rating:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Товар обновлен
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Товар не найден
 */
app.patch("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            error: "Нет данных для обновления"
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

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     description: Удаляет товар из каталога
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар успешно удален (нет тела ответа)
 *       404:
 *         description: Товар не найден
 */
app.delete("/api/products/:id", (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    
    if (!exists) {
        return res.status(404).json({
            success: false,
            error: "Товар не найден"
        });
    }
    
    products = products.filter(p => p.id !== req.params.id);
    
    res.status(204).send();
});

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Получить статистику магазина
 *     description: Возвращает общую статистику по товарам в магазине
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Статистика магазина
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProducts:
 *                       type: integer
 *                       example: 5
 *                     totalStock:
 *                       type: integer
 *                       example: 46
 *                     averagePrice:
 *                       type: number
 *                       example: 117990
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Ноутбуки", "Смартфоны", "Планшеты", "Аудио"]
 *                     cheapestProduct:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         price:
 *                           type: number
 *                     mostExpensiveProduct:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         price:
 *                           type: number
 */
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

/**
 * @swagger
 * /404:
 *   get:
 *     summary: Несуществующий маршрут
 *     tags: [Errors]
 *     responses:
 *       404:
 *         description: Маршрут не найден
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Маршрут не найден"
    });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        error: "Внутренняя ошибка сервера"
    });
});

app.listen(port, () => {
    console.log(`
    ========================================
    🚀 Сервер Дикие ягодки запущен!
    
    📡 API: http://localhost:${port}
    📚 Документация Swagger: http://localhost:${port}/api-docs
    🔧 Режим: ${process.env.NODE_ENV || 'development'}
    
    Доступные эндпоинты:
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
"use strict";
// src/shop.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = exports.addToCart = exports.filterByPrice = exports.findProduct = void 0;
/* Можна створювати інші спеціальні типи аналогічно */
/* =========================
   Крок 2 — Функції для пошуку і фільтрації
   ========================= */
/**
 * Знаходить товар за id у масиві товарів.
 * @param products Масив товарів типу T
 * @param id Ідентифікатор для пошуку (має бути цілим додатнім)
 * @returns знайдений товар або undefined
 */
const findProduct = (products, id) => {
    if (!Array.isArray(products))
        throw new TypeError("products має бути масивом");
    if (!Number.isInteger(id) || id <= 0)
        throw new TypeError("id має бути позитивним цілим числом");
    return products.find((p) => p.id === id);
};
exports.findProduct = findProduct;
/**
 * Фільтрує товари за максимальною ціною (менше або рівно maxPrice)
 * @param products Масив товарів типу T
 * @param maxPrice Максимальна ціна (має бути >= 0)
 * @returns Масив товарів з ціною <= maxPrice
 */
const filterByPrice = (products, maxPrice) => {
    if (!Array.isArray(products))
        throw new TypeError("products має бути масивом");
    if (typeof maxPrice !== "number" || Number.isNaN(maxPrice) || maxPrice < 0) {
        throw new TypeError("maxPrice має бути числом >= 0");
    }
    return products.filter((p) => typeof p.price === "number" && p.price <= maxPrice);
};
exports.filterByPrice = filterByPrice;
/**
 * Додає товар у кошик.
 * Якщо товар вже в кошику — кількість збільшується.
 * Перевіряє коректність вхідних даних.
 *
 * @param cart Існуючий масив елементів кошика (не мутуємо вхідний масив — повертаємо новий)
 * @param product Товар для додавання (не може бути undefined/null)
 * @param quantity Кількість (ціле додатнє число)
 * @returns Новий масив CartItem<T>
 */
const addToCart = (cart, product, quantity) => {
    if (!Array.isArray(cart))
        throw new TypeError("cart має бути масивом");
    if (!product) {
        // якщо передали undefined (наприклад результат findProduct), просто повертаємо незмінний кошик
        return cart.slice();
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new TypeError("quantity має бути додатнім цілим числом");
    }
    // Копія кошика (іммутабельно)
    const newCart = cart.map((it) => ({ ...it }));
    const existingIndex = newCart.findIndex((it) => it.product.id === product.id);
    if (existingIndex >= 0) {
        // Оновлюємо кількість
        const existing = newCart[existingIndex];
        newCart[existingIndex] = { product: existing.product, quantity: existing.quantity + quantity };
    }
    else {
        newCart.push({ product, quantity });
    }
    return newCart;
};
exports.addToCart = addToCart;
/**
 * Підраховує загальну суму кошика.
 * Перевіряє, що у кожного елемента є валідна ціна.
 *
 * @param cart Масив елементів кошика
 * @returns загальна вартість (число)
 */
const calculateTotal = (cart) => {
    if (!Array.isArray(cart))
        throw new TypeError("cart має бути масивом");
    return cart.reduce((sum, item) => {
        if (typeof item.product.price !== "number" || Number.isNaN(item.product.price) || item.product.price < 0) {
            throw new TypeError(`Некоректна ціна для товару id=${item.product.id}`);
        }
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            throw new TypeError(`Некоректна quantity для товару id=${item.product.id}`);
        }
        return sum + item.product.price * item.quantity;
    }, 0);
};
exports.calculateTotal = calculateTotal;
/* =========================
   Крок 4 — Приклади використання (тестові дані)
   ========================= */
const electronicsSample = [
    {
        id: 1,
        name: "Телефон X1",
        price: 12000,
        description: "Смартфон з гарною камерою",
        inStock: true,
        category: "electronics",
        brand: "PhoneCo",
        warrantyMonths: 24
    },
    {
        id: 2,
        name: "Навушники H1",
        price: 1500,
        category: "electronics",
        brand: "SoundInc",
        warrantyMonths: 12
    }
];
const clothingSample = [
    {
        id: 10,
        name: "Футболка",
        price: 400,
        category: "clothing",
        size: "M",
        material: "cotton",
        inStock: true
    },
    {
        id: 11,
        name: "Джинси",
        price: 1500,
        category: "clothing",
        size: "L",
        material: "denim"
    }
];
const booksSample = [
    {
        id: 100,
        name: "TypeScript для початківців",
        price: 600,
        category: "books",
        author: "Автор А",
        pages: 350
    }
];
/* Демонстрація функцій — ці виклики можна запускати в node (після компіляції) або в браузері */
function demo() {
    console.log("=== Demo: findProduct ===");
    const foundPhone = (0, exports.findProduct)(electronicsSample, 1);
    console.log("Знайдено телефон:", foundPhone);
    console.log("=== Demo: filterByPrice ===");
    const cheap = (0, exports.filterByPrice)([...electronicsSample, ...clothingSample, ...booksSample], 1500);
    console.log("Товари до 1500:", cheap);
    console.log("=== Demo: addToCart & calculateTotal ===");
    let cart = [];
    // додаємо телефон (знайдений)
    cart = (0, exports.addToCart)(cart, foundPhone, 1); // якщо foundPhone undefined — addToCart поверне копію кошика без змін
    // додаємо футболку
    cart = (0, exports.addToCart)(cart, clothingSample[0], 2);
    // додаємо книгу
    cart = (0, exports.addToCart)(cart, booksSample[0], 1);
    console.log("Кошик:", cart);
    const total = (0, exports.calculateTotal)(cart);
    console.log("Загальна сума:", total);
    // приклад обробки недійсних даних (показово)
    try {
        (0, exports.addToCart)(cart, clothingSample[0], 0);
    }
    catch (err) {
        console.warn("Очікувана помилка при додаванні з некоректною кількістю:", err.message);
    }
}
// Запускаємо demo автоматично, якщо цей файл виконують без модульного імпорту (не обов'язково)
if (typeof window === "undefined" || typeof window.document === "undefined") {
    // Node.js середовище — можна виконати demo
    demo();
}
else {
    // У браузері можна викликати demo() вручну з консолі
    // demo();
}

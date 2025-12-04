export type BaseProduct = {
  id: number;
  name: string;
  price: number;
  description?: string;
  inStock?: boolean;
};

export type Electronics = BaseProduct & {
  category: "electronics";
  brand?: string;
  warrantyMonths?: number;
  powerWatts?: number;
};

export type Clothing = BaseProduct & {
  category: "clothing";
  size?: string;         
  material?: string;      
  gender?: "male" | "female" | "unisex";
};

export type Book = BaseProduct & {
  category: "books";
  author?: string;
  pages?: number;
  publisher?: string;
};

export const findProduct = <T extends BaseProduct>(
  products: T[],
  id: number
): T | undefined => {
  if (!Array.isArray(products)) throw new TypeError("products має бути масивом");
  if (!Number.isInteger(id) || id <= 0) throw new TypeError("id має бути позитивним цілим числом");

  return products.find((p) => p.id === id);
};

export const filterByPrice = <T extends BaseProduct>(products: T[], maxPrice: number): T[] => {
  if (!Array.isArray(products)) throw new TypeError("products має бути масивом");
  if (typeof maxPrice !== "number" || Number.isNaN(maxPrice) || maxPrice < 0) {
    throw new TypeError("maxPrice має бути числом >= 0");
  }

  return products.filter((p) => typeof p.price === "number" && p.price <= maxPrice);
};

export type CartItem<T extends BaseProduct> = {
  product: T;
  quantity: number;
};

export const addToCart = <T extends BaseProduct>(
  cart: CartItem<T>[],
  product: T | undefined | null,
  quantity: number
): CartItem<T>[] => {
  if (!Array.isArray(cart)) throw new TypeError("cart має бути масивом");
  if (!product) {
    return cart.slice();
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new TypeError("quantity має бути додатнім цілим числом");
  }

  const newCart = cart.map((it) => ({ ...it }));

  const existingIndex = newCart.findIndex((it) => it.product.id === product.id);
  if (existingIndex >= 0) {
    const existing = newCart[existingIndex];
    newCart[existingIndex] = { product: existing.product, quantity: existing.quantity + quantity };
  } else {
    newCart.push({ product, quantity });
  }

  return newCart;
};

export const calculateTotal = <T extends BaseProduct>(cart: CartItem<T>[]): number => {
  if (!Array.isArray(cart)) throw new TypeError("cart має бути масивом");

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

const electronicsSample: Electronics[] = [
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

const clothingSample: Clothing[] = [
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

const booksSample: Book[] = [
  {
    id: 100,
    name: "TypeScript для початківців",
    price: 600,
    category: "books",
    author: "Автор А",
    pages: 350
  }
];

function demo(): void {
  console.log("=== Demo: findProduct ===");
  const foundPhone = findProduct(electronicsSample, 1);
  console.log("Знайдено телефон:", foundPhone);

  console.log("=== Demo: filterByPrice ===");
  const cheap = filterByPrice([...electronicsSample, ...clothingSample, ...booksSample], 1500);
  console.log("Товари до 1500:", cheap);

  console.log("=== Demo: addToCart & calculateTotal ===");
  let cart: CartItem<BaseProduct>[] = [];

  cart = addToCart(cart, foundPhone, 1);
  cart = addToCart(cart, clothingSample[0], 2);
  cart = addToCart(cart, booksSample[0], 1);

  console.log("Кошик:", cart);
  const total = calculateTotal(cart);
  console.log("Загальна сума:", total);

  try {
    addToCart(cart, clothingSample[0], 0);
  } catch (err) {
    console.warn("Очікувана помилка при додаванні з некоректною кількістю:", (err as Error).message);
  }
}

if (typeof window === "undefined" || typeof window.document === "undefined") {
  demo();
} else {
}


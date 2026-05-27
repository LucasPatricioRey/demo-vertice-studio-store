import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem, Product, Variant } from "./types";

type Toast = {
  id: number;
  message: string;
  tone?: "success" | "error" | "neutral";
};

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  toasts: Toast[];
  addToast: (message: string, tone?: Toast["tone"]) => void;
  addToCart: (product: Product, variant: Variant, quantity: number) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  dismissToast: (id: number) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const readLocal = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocal = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => readLocal<CartItem[]>("vs-cart", []));
  const [wishlist, setWishlist] = useState<string[]>(() => readLocal<string[]>("vs-wishlist", []));
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, tone: Toast["tone"] = "neutral") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => dismissToast(id), 4200);
  };

  const dismissToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const commitCart = (next: CartItem[]) => {
    setCart(next);
    writeLocal("vs-cart", next);
  };

  const commitWishlist = (next: string[]) => {
    setWishlist(next);
    writeLocal("vs-wishlist", next);
  };

  const addToCart = (product: Product, variant: Variant, quantity: number) => {
    const safeQuantity = Math.max(1, Math.min(quantity, variant.stock));
    const nextItem: CartItem = {
      productId: product._id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      size: variant.size,
      color: variant.color,
      colorHex: variant.colorHex,
      sku: variant.sku,
      quantity: safeQuantity,
      price: product.price,
      availableStock: variant.stock
    };

    const next = [...cart];
    const index = next.findIndex((item) => item.sku === variant.sku && item.productId === product._id);

    if (index >= 0) {
      next[index] = {
        ...next[index],
        quantity: Math.min(next[index].quantity + safeQuantity, variant.stock)
      };
    } else {
      next.push(nextItem);
    }

    commitCart(next);
    addToast("Producto agregado al carrito.", "success");
  };

  const updateQuantity = (sku: string, quantity: number) => {
    const next = cart
      .map((item) =>
        item.sku === sku ? { ...item, quantity: Math.max(1, Math.min(quantity, item.availableStock)) } : item
      )
      .filter((item) => item.quantity > 0);
    commitCart(next);
  };

  const removeFromCart = (sku: string) => {
    commitCart(cart.filter((item) => item.sku !== sku));
    addToast("Producto eliminado del carrito.", "neutral");
  };

  const clearCart = () => {
    commitCart([]);
  };

  const toggleWishlist = (slug: string) => {
    const exists = wishlist.includes(slug);
    const next = exists ? wishlist.filter((item) => item !== slug) : [...wishlist, slug];
    commitWishlist(next);
    addToast(exists ? "Producto quitado de favoritos." : "Producto guardado en favoritos.", "neutral");
  };

  const value: StoreContextValue = {
    cart,
    wishlist,
    toasts,
    addToast,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted: (slug: string) => wishlist.includes(slug),
    dismissToast
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore debe usarse dentro de StoreProvider.");
  }
  return context;
};

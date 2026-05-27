import type { AdminUser, Order, OrderStatus, Product, Stats } from "./types";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").replace(/\/$/, "");

type RequestOptions = RequestInit & {
  token?: string | null;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(payload.message ?? "No se pudo completar la operación.", response.status);
  }

  return payload as T;
};

export const publicApi = {
  getProducts: (query = "") => request<{ items: Product[]; meta: Record<string, unknown> }>(`/products${query}`),
  getProduct: (slug: string) => request<{ item: Product; related: Product[] }>(`/products/${slug}`),
  createOrder: (payload: unknown) =>
    request<{ item: Order }>("/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};

export const adminApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: AdminUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  me: (token: string) => request<{ user: AdminUser }>("/auth/me", { token }),
  stats: (token: string) => request<Stats>("/admin/stats", { token }),
  products: (token: string) => request<{ items: Product[] }>("/admin/products", { token }),
  createProduct: (token: string, payload: Partial<Product>) =>
    request<{ item: Product }>("/admin/products", {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }),
  updateProduct: (token: string, id: string, payload: Partial<Product>) =>
    request<{ item: Product }>(`/admin/products/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(payload)
    }),
  deactivateProduct: (token: string, id: string) =>
    request<{ item: Product; message: string }>(`/admin/products/${id}`, {
      method: "DELETE",
      token
    }),
  orders: (token: string) => request<{ items: Order[] }>("/admin/orders", { token }),
  updateOrderStatus: (token: string, id: string, status: OrderStatus) =>
    request<{ item: Order }>(`/admin/orders/${id}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status })
    })
};

export { API_URL };

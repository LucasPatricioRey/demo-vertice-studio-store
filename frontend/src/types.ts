export type Variant = {
  _id?: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
};

export type Product = {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  gender: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl: string;
  gallery: string[];
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isDrop: boolean;
  isActive: boolean;
  variants: Variant[];
  totalStock: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  size: string;
  color: string;
  colorHex: string;
  sku: string;
  quantity: number;
  price: number;
  availableStock: number;
};

export type DeliveryMethod = "showroom" | "moto-caba" | "envio-interior";

export type OrderStatus = "nuevo" | "contactado" | "vendido" | "cancelado";

export type Order = {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerNeighborhood: string;
  customerAddress?: string;
  deliveryMethod: DeliveryMethod;
  notes?: string;
  items: Array<{
    productId: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  status: OrderStatus;
  whatsappMessage: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type Stats = {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  newOrders: number;
  totalOrders: number;
  potentialRevenue: number;
  featuredProducts: number;
  lowStockProducts: Array<{ id: string; name: string; totalStock: number }>;
};

export type AdminUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: "admin";
};

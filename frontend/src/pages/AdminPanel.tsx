import {
  AlertTriangle,
  BarChart3,
  Check,
  Edit3,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Save,
  ShoppingBag,
  Trash2
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { adminApi } from "../api";
import type { Order, OrderStatus, Product, Stats, Variant } from "../types";
import { deliveryLabels, formatCurrency } from "../utils";

type AdminTab = "dashboard" | "products" | "orders";

type ProductFormState = {
  id?: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice: number | "";
  imageUrl: string;
  tags: string;
  isFeatured: boolean;
  isNew: boolean;
  isDrop: boolean;
  isActive: boolean;
  variants: Variant[];
};

const emptyProductForm: ProductFormState = {
  name: "",
  shortDescription: "",
  description: "",
  category: "Remeras",
  price: 28000,
  compareAtPrice: "",
  imageUrl: "vs-gradient://nuevo-producto",
  tags: "unisex, premium",
  isFeatured: false,
  isNew: true,
  isDrop: false,
  isActive: true,
  variants: [
    {
      size: "M",
      color: "Negro",
      colorHex: "#111111",
      stock: 4,
      sku: "VS-NEW-M-NEG"
    }
  ]
};

export const AdminPanel = () => {
  const [token] = useState(() => localStorage.getItem("vs-admin-token"));
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadAdmin = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [statsResponse, productsResponse, ordersResponse] = await Promise.all([
        adminApi.stats(token),
        adminApi.products(token),
        adminApi.orders(token)
      ]);
      setStats(statsResponse);
      setProducts(productsResponse.items);
      setOrders(ordersResponse.items);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No se pudo cargar el panel.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadAdmin();
  }, [loadAdmin]);

  const lowStock = useMemo(
    () => products.filter((product) => product.isActive && product.totalStock > 0 && product.totalStock <= 4),
    [products]
  );

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const logout = () => {
    localStorage.removeItem("vs-admin-token");
    localStorage.removeItem("vs-admin-user");
    navigate("/admin/login");
  };

  const editProduct = (product: Product) => {
    setTab("products");
    setForm({
      id: product._id,
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      category: product.category,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? "",
      imageUrl: product.imageUrl,
      tags: product.tags.join(", "),
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      isDrop: product.isDrop,
      isActive: product.isActive,
      variants: product.variants.map((variant) => ({ ...variant }))
    });
  };

  const saveProduct = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      shortDescription: form.shortDescription,
      description: form.description,
      category: form.category,
      gender: "Unisex",
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice === "" ? undefined : Number(form.compareAtPrice),
      imageUrl: form.imageUrl,
      gallery: [],
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isDrop: form.isDrop,
      isActive: form.isActive,
      variants: form.variants.map((variant) => ({
        ...variant,
        stock: Number(variant.stock)
      }))
    };

    try {
      if (form.id) {
        await adminApi.updateProduct(token, form.id, payload);
        setFeedback("Producto actualizado.");
      } else {
        await adminApi.createProduct(token, payload);
        setFeedback("Producto creado.");
      }
      setForm(emptyProductForm);
      await loadAdmin();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    }
  };

  const deactivateProduct = async (product: Product) => {
    try {
      await adminApi.deactivateProduct(token, product._id);
      setFeedback("Producto desactivado.");
      await loadAdmin();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No se pudo desactivar el producto.");
    }
  };

  const updateStatus = async (order: Order, status: OrderStatus) => {
    try {
      await adminApi.updateOrderStatus(token, order._id, status);
      setFeedback("Estado actualizado.");
      await loadAdmin();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No se pudo cambiar el estado.");
    }
  };

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="brand" href="/">
          <span>Vértice</span>
          <small>Admin</small>
        </a>
        <nav>
          <AdminNavButton active={tab === "dashboard"} icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => setTab("dashboard")} />
          <AdminNavButton active={tab === "products"} icon={<Package size={18} />} label="Productos" onClick={() => setTab("products")} />
          <AdminNavButton active={tab === "orders"} icon={<ShoppingBag size={18} />} label="Pedidos" onClick={() => setTab("orders")} />
        </nav>
        <button className="btn btn--ghost btn--full" onClick={logout}>
          <LogOut size={17} /> Salir
        </button>
      </aside>

      <section className="admin-main">
        <div className="admin-topbar">
          <div>
            <span className="section-kicker">Panel operativo</span>
            <h1>{tab === "dashboard" ? "Dashboard" : tab === "products" ? "Productos" : "Pedidos"}</h1>
          </div>
          <button className="btn btn--dark" onClick={() => void loadAdmin()}>
            <RefreshCw size={17} /> Actualizar
          </button>
        </div>

        {feedback ? (
          <button className="admin-feedback" onClick={() => setFeedback("")}>
            {feedback}
          </button>
        ) : null}

        {isLoading ? <div className="admin-loading">Cargando panel...</div> : null}
        {tab === "dashboard" && stats ? <Dashboard stats={stats} orders={orders} lowStock={lowStock} onEdit={editProduct} /> : null}
        {tab === "products" ? (
          <ProductsAdmin
            form={form}
            setForm={setForm}
            products={products}
            onSave={saveProduct}
            onEdit={editProduct}
            onDeactivate={deactivateProduct}
          />
        ) : null}
        {tab === "orders" ? <OrdersAdmin orders={orders} onStatus={updateStatus} /> : null}
      </section>
    </main>
  );
};

const AdminNavButton = ({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button className={active ? "active" : ""} onClick={onClick}>
    {icon}
    {label}
  </button>
);

const Dashboard = ({
  stats,
  orders,
  lowStock,
  onEdit
}: {
  stats: Stats;
  orders: Order[];
  lowStock: Product[];
  onEdit: (product: Product) => void;
}) => (
  <div className="admin-stack">
    <div className="metric-grid">
      <Metric icon={<Package size={21} />} label="Productos" value={stats.totalProducts} hint={`${stats.activeProducts} activos`} />
      <Metric icon={<ShoppingBag size={21} />} label="Pedidos nuevos" value={stats.newOrders} hint={`${stats.totalOrders} totales`} />
      <Metric icon={<AlertTriangle size={21} />} label="Sin stock" value={stats.outOfStockProducts} hint="Revisar variantes" />
      <Metric icon={<BarChart3 size={21} />} label="Potencial vendido" value={formatCurrency(stats.potentialRevenue)} hint="Simulado" />
    </div>

    <div className="admin-grid-two">
      <section className="admin-card">
        <h2>Últimos pedidos</h2>
        <div className="admin-table">
          {orders.slice(0, 6).map((order) => (
            <div className="admin-table__row" key={order._id}>
              <span>{order.customerName}</span>
              <span>{formatCurrency(order.subtotal)}</span>
              <StatusBadge status={order.status} />
            </div>
          ))}
        </div>
      </section>
      <section className="admin-card">
        <h2>Bajo stock</h2>
        <div className="admin-table">
          {lowStock.length ? (
            lowStock.map((product) => (
              <button className="admin-table__row" key={product._id} onClick={() => onEdit(product)}>
                <span>{product.name}</span>
                <span>{product.totalStock} u.</span>
                <Edit3 size={16} />
              </button>
            ))
          ) : (
            <p className="muted">No hay productos con bajo stock.</p>
          )}
        </div>
      </section>
    </div>
  </div>
);

const Metric = ({
  icon,
  label,
  value,
  hint
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  hint: string;
}) => (
  <article className="metric-card">
    {icon}
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{hint}</small>
  </article>
);

const ProductsAdmin = ({
  form,
  setForm,
  products,
  onSave,
  onEdit,
  onDeactivate
}: {
  form: ProductFormState;
  setForm: Dispatch<SetStateAction<ProductFormState>>;
  products: Product[];
  onSave: (event: FormEvent) => void;
  onEdit: (product: Product) => void;
  onDeactivate: (product: Product) => void;
}) => (
  <div className="admin-grid-two admin-grid-two--products">
    <form className="admin-card product-form" onSubmit={onSave}>
      <div className="admin-card__header">
        <h2>{form.id ? "Editar producto" : "Crear producto"}</h2>
        <button className="btn btn--primary">
          <Save size={17} /> Guardar
        </button>
      </div>
      <div className="form-grid">
        <label>
          Nombre
          <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
        </label>
        <label>
          Categoría
          <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required />
        </label>
        <label>
          Precio
          <input
            type="number"
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
            required
          />
        </label>
        <label>
          Precio anterior
          <input
            type="number"
            value={form.compareAtPrice}
            onChange={(event) =>
              setForm((current) => ({ ...current, compareAtPrice: event.target.value ? Number(event.target.value) : "" }))
            }
          />
        </label>
        <label>
          Image URL manual
          <input value={form.imageUrl} onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))} />
        </label>
        <label>
          Tags
          <input value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
        </label>
      </div>
      <label>
        Descripción corta
        <input
          value={form.shortDescription}
          onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
          required
        />
      </label>
      <label>
        Descripción
        <textarea
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          required
        />
      </label>
      <div className="switch-row">
        {[
          ["isFeatured", "Destacado"],
          ["isNew", "Nuevo"],
          ["isDrop", "Drop"],
          ["isActive", "Activo"]
        ].map(([key, label]) => (
          <label key={key} className="checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(form[key as keyof ProductFormState])}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.checked }))}
            />
            {label}
          </label>
        ))}
      </div>

      <div className="variants-editor">
        <div className="admin-card__header">
          <h3>Variantes</h3>
          <button
            type="button"
            className="btn btn--small"
            onClick={() =>
              setForm((current) => ({
                ...current,
                variants: [
                  ...current.variants,
                  { size: "M", color: "Negro", colorHex: "#111111", stock: 1, sku: `VS-${Date.now()}` }
                ]
              }))
            }
          >
            <Plus size={15} /> Agregar
          </button>
        </div>
        {form.variants.map((variant, index) => (
          <div className="variant-row" key={variant._id ?? `${variant.sku}-${index}`}>
            <input
              value={variant.size}
              aria-label="Talle"
              onChange={(event) => updateVariant(setForm, index, { size: event.target.value })}
            />
            <input
              value={variant.color}
              aria-label="Color"
              onChange={(event) => updateVariant(setForm, index, { color: event.target.value })}
            />
            <input
              value={variant.colorHex}
              aria-label="Hex"
              onChange={(event) => updateVariant(setForm, index, { colorHex: event.target.value })}
            />
            <input
              type="number"
              value={variant.stock}
              aria-label="Stock"
              onChange={(event) => updateVariant(setForm, index, { stock: Number(event.target.value) })}
            />
            <input
              value={variant.sku}
              aria-label="SKU"
              onChange={(event) => updateVariant(setForm, index, { sku: event.target.value })}
            />
            <button
              type="button"
              className="icon-btn"
              aria-label="Eliminar variante"
              onClick={() =>
                setForm((current) => ({ ...current, variants: current.variants.filter((_, variantIndex) => variantIndex !== index) }))
              }
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </form>

    <section className="admin-card">
      <h2>Listado</h2>
      <div className="product-admin-list">
        {products.map((product) => (
          <article key={product._id}>
            <div>
              <strong>{product.name}</strong>
              <span>
                {product.category} · {formatCurrency(product.price)} · {product.totalStock} u.
              </span>
            </div>
            <div>
              {!product.isActive ? <StatusBadge status="cancelado" label="Inactivo" /> : null}
              {product.isDrop ? <StatusBadge status="nuevo" label="Drop" /> : null}
              <button className="icon-btn" aria-label="Editar producto" onClick={() => onEdit(product)}>
                <Edit3 size={16} />
              </button>
              <button className="icon-btn" aria-label="Desactivar producto" onClick={() => onDeactivate(product)}>
                <EyeOff size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  </div>
);

const updateVariant = (
  setForm: Dispatch<SetStateAction<ProductFormState>>,
  index: number,
  patch: Partial<Variant>
) => {
  setForm((current) => ({
    ...current,
    variants: current.variants.map((variant, variantIndex) => (variantIndex === index ? { ...variant, ...patch } : variant))
  }));
};

const OrdersAdmin = ({ orders, onStatus }: { orders: Order[]; onStatus: (order: Order, status: OrderStatus) => void }) => (
  <section className="admin-card">
    <h2>Pedidos y consultas</h2>
    <div className="orders-table">
      {orders.map((order) => (
        <article key={order._id}>
          <div>
            <strong>{order.customerName}</strong>
            <span>
              {order.customerPhone} · {order.customerNeighborhood}
            </span>
            <small>{new Date(order.createdAt).toLocaleDateString("es-AR")}</small>
          </div>
          <div>
            {order.items.map((item) => (
              <span key={`${order._id}-${item.name}-${item.size}`}>
                {item.quantity}x {item.name} ({item.size}, {item.color})
              </span>
            ))}
          </div>
          <strong>{formatCurrency(order.subtotal)}</strong>
          <span>{deliveryLabels[order.deliveryMethod]}</span>
          <select value={order.status} onChange={(event) => onStatus(order, event.target.value as OrderStatus)}>
            <option value="nuevo">nuevo</option>
            <option value="contactado">contactado</option>
            <option value="vendido">vendido</option>
            <option value="cancelado">cancelado</option>
          </select>
        </article>
      ))}
    </div>
  </section>
);

const StatusBadge = ({ status, label }: { status: OrderStatus; label?: string }) => (
  <span className={`status status--${status}`}>
    {status === "vendido" ? <Check size={13} /> : null}
    {label ?? status}
  </span>
);

import {
  ArrowRight,
  ChevronDown,
  Heart,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Navigation,
  PackageCheck,
  Plus,
  RefreshCw,
  Ruler,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Truck,
  X
} from "lucide-react";
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { API_URL, publicApi } from "../api";
import { ProductVisual } from "../components/ProductVisual";
import { verticeImages } from "../assets";
import { fallbackProducts } from "../data/fallbackProducts";
import { useStore } from "../store";
import type { CartItem, DeliveryMethod, Product } from "../types";
import {
  BRAND_NAME,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatCurrency,
  getProductStock,
  unique
} from "../utils";

type SortKey = "nuevos" | "menor-precio" | "mayor-precio" | "destacados";
type ProductFlag = "todos" | "destacados" | "nuevos" | "drop";

const navItems = [
  ["Inicio", "#inicio"],
  ["Catálogo", "#catalogo"],
  ["Drop", "#drop"],
  ["Cómo comprar", "#como-comprar"],
  ["Showroom", "#showroom"],
  ["FAQ", "#faq"]
];

const sizeRows = [
  { type: "Remeras", S: "52 x 68", M: "55 x 71", L: "58 x 74", XL: "61 x 77" },
  { type: "Hoodies", S: "56 x 66", M: "59 x 69", L: "62 x 72", XL: "65 x 75" },
  { type: "Pantalones", S: "38-40", M: "42-44", L: "46-48", XL: "50-52" }
];

const deliveryOptions: Array<{ value: DeliveryMethod; label: string; description: string }> = [
  {
    value: "showroom",
    label: "Retiro en showroom",
    description: "Coordinamos día y horario en Palermo."
  },
  {
    value: "moto-caba",
    label: "Moto CABA",
    description: "Mensajería dentro de CABA a coordinar."
  },
  {
    value: "envio-interior",
    label: "Envío al interior",
    description: "Despacho por correo o transporte según destino."
  }
];

const handleTiltMove = (event: MouseEvent<HTMLElement>) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;

  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;

  element.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
  element.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
  element.style.setProperty("--tilt-z", `${(x * 5).toFixed(2)}deg`);
  element.style.setProperty("--glow-x", `${((x + 0.5) * 100).toFixed(0)}%`);
  element.style.setProperty("--glow-y", `${((y + 0.5) * 100).toFixed(0)}%`);
};

const resetTilt = (event: MouseEvent<HTMLElement>) => {
  const element = event.currentTarget;
  element.style.removeProperty("--tilt-x");
  element.style.removeProperty("--tilt-y");
  element.style.removeProperty("--tilt-z");
  element.style.removeProperty("--glow-x");
  element.style.removeProperty("--glow-y");
};

export const PublicStore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [size, setSize] = useState("Todos");
  const [color, setColor] = useState("Todos");
  const [priceMax, setPriceMax] = useState(120000);
  const [sort, setSort] = useState<SortKey>("destacados");
  const [flag, setFlag] = useState<ProductFlag>("todos");

  const { cart, wishlist, toasts, dismissToast } = useStore();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await publicApi.getProducts();
        setProducts(response.items);
        setApiNotice("");
      } catch {
        setProducts(fallbackProducts);
        setApiNotice("Catálogo en modo visual. Con MONGODB_URI configurado se consume la API real.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const categories = useMemo(() => ["Todos", ...unique(products.map((product) => product.category)).sort()], [products]);
  const sizes = useMemo(
    () => ["Todos", ...unique(products.flatMap((product) => product.variants.map((variant) => variant.size))).sort()],
    [products]
  );
  const colors = useMemo(
    () => ["Todos", ...unique(products.flatMap((product) => product.variants.map((variant) => variant.color))).sort()],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const sorted = products
      .filter((product) => product.isActive)
      .filter((product) => (category === "Todos" ? true : product.category === category))
      .filter((product) => (size === "Todos" ? true : product.variants.some((variant) => variant.size === size)))
      .filter((product) => (color === "Todos" ? true : product.variants.some((variant) => variant.color === color)))
      .filter((product) => product.price <= priceMax)
      .filter((product) => {
        if (flag === "destacados") return product.isFeatured;
        if (flag === "nuevos") return product.isNew;
        if (flag === "drop") return product.isDrop;
        return true;
      })
      .filter((product) => {
        if (!term) return true;
        const haystack = [product.name, product.description, product.category, product.tags.join(" ")].join(" ").toLowerCase();
        return haystack.includes(term);
      });

    return sorted.sort((a, b) => {
      if (sort === "menor-precio") return a.price - b.price;
      if (sort === "mayor-precio") return b.price - a.price;
      if (sort === "destacados") return Number(b.isFeatured) - Number(a.isFeatured) || Number(b.isNew) - Number(a.isNew);
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });
  }, [category, color, flag, priceMax, products, search, size, sort]);

  const dropProducts = products.filter((product) => product.isDrop && product.isActive).slice(0, 4);
  const heroVisual = {
    name: "Editorial nocturna Vértice Studio",
    category: "Vértice Studio",
    imageUrl: verticeImages.hero,
    isDrop: true
  };
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="site-shell">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        isMobileOpen={isMobileOpen}
        onCart={() => setIsCartOpen(true)}
        onWishlist={() => setIsWishlistOpen(true)}
        onMobile={() => setIsMobileOpen((value) => !value)}
      />

      <main>
        <section className="hero" id="inicio">
          <div className="hero__content">
            <div className="eyebrow"><Sparkles size={16} /> Nuevo drop / stock real</div>
            <h1>Streetwear premium para marcas que venden por WhatsApp.</h1>
            <p>
              Catálogo editable, stock por talle y color, carrito serio y pedidos guardados antes de abrir la conversación.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#catalogo">
                Ver colección <ArrowRight size={18} />
              </a>
              <a className="btn btn--ghost" href={buildWhatsAppUrl(`Hola Lucas, quiero consultar por la demo ${BRAND_NAME}.`)}>
                <MessageCircle size={18} /> Consultar por WhatsApp
              </a>
            </div>
            <div className="hero__badges" aria-label="Beneficios principales">
              <span>Nuevo drop</span>
              <span>Stock limitado</span>
              <span>Showroom Palermo</span>
              <span>Pedidos por WhatsApp</span>
            </div>
          </div>

          <div className="hero__visual scene-3d" aria-hidden="true" onMouseMove={handleTiltMove} onMouseLeave={resetTilt}>
            <ProductVisual product={heroVisual} priority="hero" />
            <div className="hero-orbit" />
            <div className="hero-card hero-card--top">
              <span>Drop activo</span>
              <strong>{dropProducts.length || 4} piezas</strong>
            </div>
            <div className="hero-card hero-card--bottom">
              <span>Venta asistida</span>
              <strong>WhatsApp + admin</strong>
            </div>
            <div className="hero-card hero-card--side">
              <span>Stock real</span>
              <strong>Talle + color</strong>
            </div>
          </div>
        </section>

        <section className="trust-bar" aria-label="Beneficios de compra">
          <Benefit icon={<RefreshCw size={20} />} title="Cambios simples" text="Dentro de 10 días, sujeto a stock." />
          <Benefit icon={<MapPin size={20} />} title="Showroom Palermo" text="Retiro coordinado por WhatsApp." />
          <Benefit icon={<Truck size={20} />} title="Envíos" text="CABA e interior a coordinar." />
          <Benefit icon={<ShieldCheck size={20} />} title="Stock actualizado" text="Variantes reales por talle y color." />
          <Benefit icon={<MessageCircle size={20} />} title="Asesoramiento" text="Cierre comercial por WhatsApp." />
        </section>

        <section className="section catalog-section" id="catalogo">
          <div className="section__heading">
            <span className="section-kicker">Catálogo editable</span>
            <h2>Colección inicial lista para vender</h2>
            <p>Filtros por categoría, talle, color, precio y estado comercial del producto.</p>
          </div>

          <div className="collection-banner">
            <img src={verticeImages.bannerBasicos} alt="Colección de básicos premium Vértice Studio" loading="lazy" decoding="async" />
            <div>
              <span>Base permanente</span>
              <strong>Prendas esenciales, stock editable y fotos listas para vender.</strong>
            </div>
          </div>

          <div className="catalog-layout">
            <aside className="filters" aria-label="Filtros del catálogo">
              <div className="filters__title">
                <SlidersHorizontal size={18} />
                <span>Filtros</span>
              </div>
              <label>
                Buscar
                <div className="input-icon">
                  <Search size={16} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Remera, hoodie, cargo..." />
                </div>
              </label>
              <FilterSelect label="Categoría" value={category} options={categories} onChange={setCategory} />
              <FilterSelect label="Talle" value={size} options={sizes} onChange={setSize} />
              <FilterSelect label="Color" value={color} options={colors} onChange={setColor} />
              <label>
                Precio máximo <strong>{formatCurrency(priceMax)}</strong>
                <input
                  className="range"
                  type="range"
                  min="20000"
                  max="120000"
                  step="5000"
                  value={priceMax}
                  onChange={(event) => setPriceMax(Number(event.target.value))}
                />
              </label>
              <FilterSelect
                label="Mostrar"
                value={flag}
                options={["todos", "destacados", "nuevos", "drop"]}
                onChange={(value) => setFlag(value as ProductFlag)}
              />
              <FilterSelect
                label="Ordenar"
                value={sort}
                options={["destacados", "nuevos", "menor-precio", "mayor-precio"]}
                onChange={(value) => setSort(value as SortKey)}
              />
            </aside>

            <div className="catalog-results">
              <div className="catalog-results__bar">
                <span>{isLoading ? "Cargando productos..." : `${filteredProducts.length} productos encontrados`}</span>
                {apiNotice ? <small>{apiNotice}</small> : <small>API: {API_URL}</small>}
              </div>

              {isLoading ? (
                <div className="product-grid">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div className="product-card skeleton-card" key={index} />
                  ))}
                </div>
              ) : filteredProducts.length ? (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} onOpen={() => setSelectedProduct(product)} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No encontramos productos con esos filtros.</h3>
                  <p>Probá limpiar búsqueda o cambiar categoría para ver más opciones.</p>
                  <button className="btn btn--dark" onClick={() => {
                    setSearch("");
                    setCategory("Todos");
                    setSize("Todos");
                    setColor("Todos");
                    setFlag("todos");
                    setPriceMax(120000);
                  }}>
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <DropSection products={dropProducts} onOpen={setSelectedProduct} />
        <HowToBuy />
        <ShowroomSection />
        <SizeGuide />
        <PolicySection />
        <Testimonials />
        <FAQ />
        <FinalCta />
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        products={products}
        onClose={() => setIsWishlistOpen(false)}
        onOpenProduct={setSelectedProduct}
      />
      {selectedProduct ? <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} /> : null}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <button key={toast.id} className={`toast toast--${toast.tone ?? "neutral"}`} onClick={() => dismissToast(toast.id)}>
            {toast.message}
          </button>
        ))}
      </div>
    </div>
  );
};

const Header = ({
  cartCount,
  wishlistCount,
  isMobileOpen,
  onCart,
  onWishlist,
  onMobile
}: {
  cartCount: number;
  wishlistCount: number;
  isMobileOpen: boolean;
  onCart: () => void;
  onWishlist: () => void;
  onMobile: () => void;
}) => (
  <header className="header">
    <a className="brand" href="#inicio" aria-label="Ir al inicio">
      <span>Vértice</span>
      <small>Studio</small>
    </a>
    <nav className="nav">
      {navItems.map(([label, href]) => (
        <a key={href} href={href}>
          {label}
        </a>
      ))}
    </nav>
    <div className="header__actions">
      <button className="icon-btn" aria-label="Favoritos" onClick={onWishlist}>
        <Heart size={19} />
        {wishlistCount ? <span>{wishlistCount}</span> : null}
      </button>
      <button className="icon-btn" aria-label="Carrito" onClick={onCart}>
        <ShoppingBag size={19} />
        {cartCount ? <span>{cartCount}</span> : null}
      </button>
      <a className="btn btn--header" href={buildWhatsAppUrl(`Hola Lucas, quiero consultar por la tienda demo ${BRAND_NAME}.`)}>
        <MessageCircle size={17} /> WhatsApp
      </a>
      <button className="icon-btn icon-btn--mobile" aria-label="Abrir menú" onClick={onMobile}>
        {isMobileOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
    </div>
    {isMobileOpen ? (
      <div className="mobile-menu">
        {navItems.map(([label, href]) => (
          <a key={href} href={href} onClick={onMobile}>
            {label}
          </a>
        ))}
        <a href="/admin/login">Admin</a>
      </div>
    ) : null}
  </header>
);

const Benefit = ({ icon, title, text }: { icon: ReactNode; title: string; text: string }) => (
  <article>
    {icon}
    <div>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  </article>
);

const FilterSelect = ({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <label>
    {label}
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const ProductCard = ({ product, onOpen }: { product: Product; onOpen: () => void }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const firstAvailable = product.variants.find((variant) => variant.stock > 0);
  const stock = getProductStock(product);
  const availableSizes = unique(product.variants.filter((variant) => variant.stock > 0).map((variant) => variant.size)).slice(0, 4);
  const availableColors = product.variants
    .filter((variant) => variant.stock > 0)
    .filter((variant, index, list) => list.findIndex((item) => item.color === variant.color) === index)
    .slice(0, 4);

  return (
    <article className="product-card tilt-card" onMouseMove={handleTiltMove} onMouseLeave={resetTilt}>
      <button className="product-card__media" onClick={onOpen}>
        <ProductVisual product={product} />
        <div className="badge-stack">
          {product.isNew ? <span>Nuevo</span> : null}
          {product.isDrop ? <span>Drop</span> : null}
          {product.isFeatured ? <span>Destacado</span> : null}
          {!stock ? <span>Sin stock</span> : null}
        </div>
      </button>
      <div className="product-card__body">
        <div>
          <span className="product-card__category">{product.category}</span>
          <h3>{product.name}</h3>
        </div>
        <button className="icon-btn icon-btn--plain" aria-label="Guardar favorito" onClick={() => toggleWishlist(product.slug)}>
          <Heart size={18} fill={isWishlisted(product.slug) ? "currentColor" : "none"} />
        </button>
      </div>
      <p>{product.shortDescription}</p>
      <div className="product-card__meta" aria-label="Disponibilidad">
        <span>{stock ? `${stock} u. disponibles` : "Sin stock"}</span>
        <div className="mini-sizes">
          {availableSizes.map((item) => (
            <i key={item}>{item}</i>
          ))}
        </div>
        <div className="mini-swatches">
          {availableColors.map((variant) => (
            <i key={`${variant.color}-${variant.colorHex}`} style={{ backgroundColor: variant.colorHex }} title={variant.color} />
          ))}
        </div>
      </div>
      <div className="product-card__footer">
        <div>
          <strong>{formatCurrency(product.price)}</strong>
          {product.compareAtPrice ? <span>{formatCurrency(product.compareAtPrice)}</span> : null}
        </div>
        <div className="product-card__actions">
          <button className="btn btn--small" onClick={onOpen}>
            Ver detalle
          </button>
          <button
            className="btn btn--small btn--dark"
            disabled={!firstAvailable}
            onClick={() => firstAvailable && addToCart(product, firstAvailable, 1)}
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};

const ProductModal = ({ product, onClose }: { product: Product; onClose: () => void }) => {
  const { addToCart } = useStore();
  const firstAvailable = product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];
  const [selectedSize, setSelectedSize] = useState(firstAvailable?.size ?? "");
  const [selectedColor, setSelectedColor] = useState(firstAvailable?.color ?? "");
  const [quantity, setQuantity] = useState(1);

  const sizes = unique(product.variants.map((variant) => variant.size));
  const colorsForSize = unique(product.variants.filter((variant) => variant.size === selectedSize).map((variant) => variant.color));
  const selectedVariant =
    product.variants.find((variant) => variant.size === selectedSize && variant.color === selectedColor) ??
    product.variants.find((variant) => variant.size === selectedSize) ??
    firstAvailable;

  const stock = selectedVariant?.stock ?? 0;

  const handleSize = (value: string) => {
    setSelectedSize(value);
    const nextColor = product.variants.find((variant) => variant.size === value && variant.stock > 0)?.color;
    if (nextColor) setSelectedColor(nextColor);
    setQuantity(1);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="product-modal">
        <button className="icon-btn modal-close" aria-label="Cerrar detalle" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="product-modal__media">
          <ProductVisual product={product} priority="wide" />
          <div className="modal-gallery">
            {[product.imageUrl, ...product.gallery].slice(0, 3).map((imageUrl, index) => (
              <ProductVisual key={`${imageUrl}-${index}`} product={{ ...product, imageUrl }} />
            ))}
          </div>
        </div>
        <div className="product-modal__content">
          <span className="section-kicker">{product.category} / {product.gender}</span>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <div className="price-line">
            <strong>{formatCurrency(product.price)}</strong>
            {product.compareAtPrice ? <span>{formatCurrency(product.compareAtPrice)}</span> : null}
          </div>

          <div className="material-panel">
            <img src={verticeImages.texturaAlgodon} alt="Detalle textil premium" loading="lazy" decoding="async" />
            <div>
              <span>Materiales</span>
              <strong>Terminación premium, tacto pesado y costuras reforzadas.</strong>
            </div>
          </div>

          <div className="selector-group">
            <span>Talle</span>
            <div className="pill-row">
              {sizes.map((item) => (
                <button key={item} className={item === selectedSize ? "active" : ""} onClick={() => handleSize(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <span>Color</span>
            <div className="swatch-row">
              {colorsForSize.map((item) => {
                const variant = product.variants.find((candidate) => candidate.size === selectedSize && candidate.color === item);
                return (
                  <button
                    key={item}
                    className={item === selectedColor ? "active" : ""}
                    onClick={() => {
                      setSelectedColor(item);
                      setQuantity(1);
                    }}
                  >
                    <i style={{ backgroundColor: variant?.colorHex }} />
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="stock-panel">
            <PackageCheck size={18} />
            {stock > 0 ? <span>{stock} unidades disponibles para esta variante.</span> : <span>Sin stock para esta variante.</span>}
          </div>

          <div className="quantity-row">
            <span>Cantidad</span>
            <div>
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1}>
                <Minus size={16} />
              </button>
              <strong>{quantity}</strong>
              <button onClick={() => setQuantity((value) => Math.min(stock, value + 1))} disabled={quantity >= stock}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="btn btn--primary"
              disabled={!selectedVariant || stock <= 0}
              onClick={() => selectedVariant && addToCart(product, selectedVariant, quantity)}
            >
              <ShoppingBag size={18} /> Agregar al carrito
            </button>
            <a
              className="btn btn--ghost"
              href={buildWhatsAppUrl(`Hola Lucas, quiero consultar por ${product.name} de la demo ${BRAND_NAME}.`)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} /> Consultar
            </a>
          </div>

          <details className="size-detail">
            <summary>
              <Ruler size={17} /> Guía de talles compacta <ChevronDown size={17} />
            </summary>
            <SizeTable />
          </details>
        </div>
      </div>
    </div>
  );
};

const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, addToast } = useStore();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNeighborhood, setCustomerNeighborhood] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("showroom");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const submitOrder = async () => {
    if (!cart.length) {
      addToast("Agregá al menos un producto.", "error");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerNeighborhood.trim()) {
      addToast("Completá nombre, teléfono y barrio/localidad.", "error");
      return;
    }

    const whatsappMessage = buildWhatsAppMessage({
      items: cart,
      subtotal,
      deliveryMethod,
      customerName,
      customerPhone,
      customerNeighborhood,
      customerAddress,
      notes
    });
    const whatsappUrl = buildWhatsAppUrl(whatsappMessage);
    const whatsappWindow = window.open("about:blank", "_blank");

    if (whatsappWindow) {
      whatsappWindow.opener = null;
    }

    const payload = {
      customerName,
      customerPhone,
      customerNeighborhood,
      customerAddress,
      deliveryMethod,
      notes,
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      whatsappMessage,
      source: "demo-web"
    };

    setIsSubmitting(true);
    try {
      await publicApi.createOrder(payload);
      addToast("Pedido guardado. Abriendo WhatsApp.", "success");
      clearCart();
    } catch {
      addToast("No se pudo guardar en backend. Abrimos WhatsApp como fallback.", "error");
    } finally {
      setIsSubmitting(false);
      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }
    }
  };

  return (
    <aside className={`drawer ${isOpen ? "drawer--open" : ""}`} aria-hidden={!isOpen}>
      <div className="drawer__header">
        <div>
          <span className="section-kicker">Pedido por WhatsApp</span>
          <h2>Carrito</h2>
        </div>
        <button className="icon-btn" aria-label="Cerrar carrito" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="drawer__body">
        {cart.length ? (
          cart.map((item) => (
            <CartRow key={`${item.productId}-${item.sku}`} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
          ))
        ) : (
          <div className="empty-state empty-state--compact">
            <ShoppingBag size={28} />
            <p>Tu carrito está vacío.</p>
          </div>
        )}

        <div className="checkout-form">
          <label>
            Nombre
            <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Tu nombre" />
          </label>
          <label>
            Teléfono
            <input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="11 5409 7209" />
          </label>
          <label>
            Barrio / localidad
            <input
              value={customerNeighborhood}
              onChange={(event) => setCustomerNeighborhood(event.target.value)}
              placeholder="Palermo, CABA"
            />
          </label>
          <label>
            Dirección opcional
            <input value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} placeholder="Solo si pedís envío" />
          </label>
          <div className="delivery-list">
            {deliveryOptions.map((option) => (
              <button
                key={option.value}
                className={deliveryMethod === option.value ? "active" : ""}
                onClick={() => setDeliveryMethod(option.value)}
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            ))}
          </div>
          <label>
            Observaciones
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Horario, dudas de talle o referencia." />
          </label>
        </div>
      </div>

      <div className="drawer__footer">
        <div className="subtotal-row">
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <button className="btn btn--primary btn--full" disabled={isSubmitting || !cart.length} onClick={submitOrder}>
          <MessageCircle size={18} /> {isSubmitting ? "Guardando..." : "Enviar pedido por WhatsApp"}
        </button>
      </div>
    </aside>
  );
};

const CartRow = ({
  item,
  updateQuantity,
  removeFromCart
}: {
  item: CartItem;
  updateQuantity: (sku: string, quantity: number) => void;
  removeFromCart: (sku: string) => void;
}) => (
  <article className="cart-row">
    <div className="cart-row__visual" style={{ backgroundColor: item.colorHex }} />
    <div>
      <strong>{item.name}</strong>
      <span>
        {item.size} / {item.color}
      </span>
      <small>{formatCurrency(item.price)}</small>
    </div>
    <div className="cart-row__actions">
      <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} disabled={item.quantity <= 1}>
        <Minus size={14} />
      </button>
      <span>{item.quantity}</span>
      <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} disabled={item.quantity >= item.availableStock}>
        <Plus size={14} />
      </button>
      <button onClick={() => removeFromCart(item.sku)}>
        <X size={14} />
      </button>
    </div>
  </article>
);

const WishlistDrawer = ({
  isOpen,
  products,
  onClose,
  onOpenProduct
}: {
  isOpen: boolean;
  products: Product[];
  onClose: () => void;
  onOpenProduct: (product: Product) => void;
}) => {
  const { wishlist } = useStore();
  const favorites = products.filter((product) => wishlist.includes(product.slug));
  const message = `Hola Lucas, quiero consultar por mis favoritos de la demo ${BRAND_NAME}: ${favorites
    .map((product) => product.name)
    .join(", ")}.`;

  return (
    <aside className={`drawer drawer--wishlist ${isOpen ? "drawer--open" : ""}`} aria-hidden={!isOpen}>
      <div className="drawer__header">
        <div>
          <span className="section-kicker">Favoritos</span>
          <h2>Wishlist</h2>
        </div>
        <button className="icon-btn" aria-label="Cerrar favoritos" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="drawer__body">
        {favorites.length ? (
          favorites.map((product) => (
            <button className="wishlist-row" key={product._id} onClick={() => onOpenProduct(product)}>
              <ProductVisual product={product} />
              <span>{product.name}</span>
              <strong>{formatCurrency(product.price)}</strong>
            </button>
          ))
        ) : (
          <div className="empty-state empty-state--compact">
            <Heart size={28} />
            <p>Guardá productos para compararlos o consultarlos juntos.</p>
          </div>
        )}
      </div>
      <div className="drawer__footer">
        <a className="btn btn--primary btn--full" href={buildWhatsAppUrl(message)} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> Consultar favoritos
        </a>
      </div>
    </aside>
  );
};

const DropSection = ({ products, onOpen }: { products: Product[]; onOpen: (product: Product) => void }) => (
  <section className="section drop-section" id="drop">
    <div className="drop-copy">
      <span className="section-kicker">Drop limitado</span>
      <h2>Piezas de baja tirada para generar urgencia real.</h2>
      <p>La sección editorial destaca productos con poco stock y permite vender lanzamientos desde Instagram sin perder control del inventario.</p>
      <div className="drop-stats" aria-label="Datos del drop">
        <span><strong>72 hs</strong> ventana comercial</span>
        <span><strong>15</strong> unidades promedio</span>
        <span><strong>100%</strong> consulta asistida</span>
      </div>
      <a className="btn btn--dark" href="#catalogo">
        Ver drop <ArrowRight size={18} />
      </a>
    </div>
    <div className="drop-showcase">
      <figure className="drop-editorial">
        <img src={verticeImages.dropLimitado} alt="Rack editorial de drop limitado Vértice Studio" loading="lazy" decoding="async" />
        <figcaption>Rack editorial / pocas unidades</figcaption>
      </figure>
      <div className="drop-grid">
        {products.map((product) => (
          <button key={product._id} onClick={() => onOpen(product)}>
            <ProductVisual product={product} priority="wide" />
            <span>{product.name}</span>
          </button>
        ))}
      </div>
    </div>
  </section>
);

const HowToBuy = () => (
  <section className="section steps-section" id="como-comprar">
    <div className="steps-layout">
      <div>
        <div className="section__heading">
          <span className="section-kicker">Cómo comprar</span>
          <h2>Del catálogo a WhatsApp sin fricción</h2>
        </div>
        <div className="steps-grid">
          {["Elegí producto", "Seleccioná talle y color", "Agregalo al carrito", "Enviá tu pedido", "Coordinamos pago y entrega"].map(
            (step, index) => (
              <article key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </article>
            )
          )}
        </div>
      </div>
      <figure className="section-media section-media--phone">
        <img src={verticeImages.whatsappFlow} alt="Flujo visual de pedido por WhatsApp con prendas Vértice Studio" loading="lazy" decoding="async" />
        <figcaption>Pedido guardado + mensaje listo para enviar</figcaption>
      </figure>
    </div>
  </section>
);

const ShowroomSection = () => (
  <section className="section showroom-section" id="showroom">
    <div className="showroom-card">
      <span className="section-kicker">Showroom</span>
      <h2>Palermo, CABA</h2>
      <p>Dirección ficticia: Costa Rica 4820, Palermo. Atención con cita previa de martes a sábado, 12 a 19 hs.</p>
      <div className="showroom-meta">
        <span>Retiro en showroom</span>
        <strong>Mar a sáb / 12 a 19 hs</strong>
      </div>
      <div className="showroom-actions">
        <a className="btn btn--primary" href={buildWhatsAppUrl(`Hola Lucas, quiero coordinar retiro en showroom para ${BRAND_NAME}.`)}>
          <MessageCircle size={18} /> Coordinar visita
        </a>
        <a className="btn btn--ghost" href="https://maps.google.com/?q=Palermo%2C%20CABA" target="_blank" rel="noreferrer">
          <Navigation size={18} /> Cómo llegar
        </a>
      </div>
      <p className="instagram-line">
        <Instagram size={17} /> @verticestudio.ar
      </p>
    </div>
    <div className="showroom-visual">
      <img src={verticeImages.showroom} alt="Showroom premium Vértice Studio en Palermo" loading="lazy" decoding="async" />
      <span>Showroom Palermo</span>
      <strong>Probador, retiro y asesoramiento</strong>
    </div>
  </section>
);

const SizeGuide = () => (
  <section className="section size-section">
    <div className="section__heading">
      <span className="section-kicker">Guía de talles</span>
      <h2>Medidas claras antes de consultar</h2>
      <p>Tabla base de referencia en centímetros para reducir dudas y cambios innecesarios.</p>
    </div>
    <div className="size-layout">
      <figure className="section-media">
        <img src={verticeImages.guiaTalles} alt="Guía visual de medidas para prendas Vértice Studio" loading="lazy" decoding="async" />
      </figure>
      <SizeTable />
    </div>
  </section>
);

const SizeTable = () => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Prenda</th>
          <th>S</th>
          <th>M</th>
          <th>L</th>
          <th>XL</th>
        </tr>
      </thead>
      <tbody>
        {sizeRows.map((row) => (
          <tr key={row.type}>
            <td>{row.type}</td>
            <td>{row.S}</td>
            <td>{row.M}</td>
            <td>{row.L}</td>
            <td>{row.XL}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PolicySection = () => (
  <section className="section policy-grid">
    <article>
      <RefreshCw size={22} />
      <h3>Cambios y devoluciones</h3>
      <p>
        Cambios dentro de 10 días corridos, prenda sin uso, con etiqueta y sujeto a stock disponible. Condiciones ajustables para cada cliente real.
      </p>
      <img src={verticeImages.texturaAlgodon} alt="Detalle de textura y costura premium" loading="lazy" decoding="async" />
    </article>
    <article>
      <Truck size={22} />
      <h3>Envíos</h3>
      <p>Retiro en showroom Palermo, moto mensajería CABA y envíos al interior. Costos y tiempos se coordinan por WhatsApp.</p>
      <img src={verticeImages.packaging} alt="Packaging premium para envíos Vértice Studio" loading="lazy" decoding="async" />
    </article>
  </section>
);

const Testimonials = () => (
  <section className="section testimonials">
    <div className="testimonials-layout">
      <figure className="section-media">
        <img src={verticeImages.lifestyle} alt="Comunidad streetwear Vértice Studio en Palermo" loading="lazy" decoding="async" />
      </figure>
      <div>
        <div className="section__heading">
          <span className="section-kicker">Reseñas</span>
          <h2>Prueba social para una tienda inicial</h2>
        </div>
        <div className="testimonial-grid">
          {[
            "Compré por WhatsApp y coordinamos retiro en el showroom.",
            "La guía de talles me ayudó a elegir bien sin tener que preguntar tanto.",
            "Muy buena calidad y atención rápida. El carrito hace todo más claro."
          ].map((quote) => (
            <article key={quote}>
              <div>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={15} fill="currentColor" />
                ))}
              </div>
              <p>“{quote}”</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FAQ = () => (
  <section className="section faq-section" id="faq">
    <div className="section__heading">
      <span className="section-kicker">FAQ</span>
      <h2>Preguntas frecuentes</h2>
    </div>
    <div className="faq-list">
      {[
        ["¿Cómo compro?", "Elegís productos, seleccionás variantes, completás el carrito y enviás el pedido por WhatsApp."],
        ["¿Tienen showroom?", "Sí, el showroom ficticio de esta demo está ubicado en Palermo, CABA, con cita previa."],
        ["¿Hacen envíos?", "Sí, moto mensajería en CABA y envíos al interior con costo a coordinar."],
        ["¿Cómo sé mi talle?", "Cada producto permite seleccionar talle y color, y la tienda incluye una guía de talles compacta."],
        ["¿Puedo cambiar una prenda?", "Sí, dentro del plazo definido por la marca, con prenda sin uso y sujeto a stock."],
        ["¿El stock está actualizado?", "Sí, el admin permite cargar stock por talle y color para que el catálogo muestre disponibilidad real."],
        ["¿Puedo pedir por WhatsApp?", "Sí, el cierre final es por WhatsApp. El backend guarda la consulta antes de abrir el chat."]
      ].map(([question, answer]) => (
        <details key={question}>
          <summary>
            {question}
            <ChevronDown size={18} />
          </summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  </section>
);

const FinalCta = () => (
  <section className="final-cta">
    <div>
      <span className="section-kicker">Stock, pedidos y WhatsApp</span>
      <h2>Armá tu pedido y consultá disponibilidad en segundos.</h2>
    </div>
    <img src={verticeImages.outfitCompleto} alt="Look completo urbano Vértice Studio" loading="lazy" decoding="async" />
    <div className="hero__actions">
      <a className="btn btn--primary" href="#catalogo">
        Ver catálogo <ArrowRight size={18} />
      </a>
      <a className="btn btn--ghost" href={buildWhatsAppUrl(`Hola Lucas, quiero consultar por ${BRAND_NAME}.`)}>
        <MessageCircle size={18} /> Consultar por WhatsApp
      </a>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <div>
      <a className="brand" href="#inicio">
        <span>Vértice</span>
        <small>Studio</small>
      </a>
      <p>Streetwear premium unisex con catálogo editable, stock real y pedidos por WhatsApp.</p>
    </div>
    <div>
      <strong>Links</strong>
      {navItems.map(([label, href]) => (
        <a key={href} href={href}>
          {label}
        </a>
      ))}
    </div>
    <div>
      <strong>Contacto</strong>
      <a href={buildWhatsAppUrl(`Hola Lucas, quiero consultar por la demo ${BRAND_NAME}.`)}>WhatsApp</a>
      <span>@verticestudio.ar</span>
      <span>Palermo, CABA</span>
      <span>Mar a sáb / 12 a 19 hs</span>
    </div>
    <div>
      <strong>Lucas Rey</strong>
      <span>Demo creada por Lucas Rey</span>
      <span>Sitio demostrativo para presentación comercial.</span>
    </div>
  </footer>
);

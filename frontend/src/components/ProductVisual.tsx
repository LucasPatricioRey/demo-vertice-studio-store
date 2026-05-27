import type { Product } from "../types";

const gradients: Record<string, string> = {
  "vs-gradient://remera-essential": "linear-gradient(145deg, #111 0%, #2f302d 42%, #f4efe7 100%)",
  "vs-gradient://hoodie-core": "linear-gradient(145deg, #1a1b1c 0%, #4d5357 52%, #b6a185 100%)",
  "vs-gradient://cargo-urbano": "linear-gradient(145deg, #20231f 0%, #66735c 55%, #c8b89f 100%)",
  "vs-gradient://bomber-nomade": "linear-gradient(145deg, #101010 0%, #53687b 58%, #c36f44 100%)",
  "vs-gradient://tote-studio": "linear-gradient(145deg, #111 0%, #efe7d6 52%, #9b988e 100%)",
  "vs-gradient://gorra-minimal": "linear-gradient(145deg, #111 0%, #343838 60%, #66735c 100%)",
  "vs-gradient://washed-black": "linear-gradient(145deg, #0d0d0d 0%, #242424 46%, #77736a 100%)",
  "vs-gradient://hoodie-arena": "linear-gradient(145deg, #2b2b2d 0%, #c8b89f 62%, #f4efe7 100%)",
  "vs-gradient://wide-leg": "linear-gradient(145deg, #111 0%, #9b988e 56%, #d0c7b7 100%)",
  "vs-gradient://chomba-boxy": "linear-gradient(145deg, #f4efe7 0%, #7a806f 58%, #222 100%)",
  "vs-gradient://overshirt": "linear-gradient(145deg, #252525 0%, #9b988e 55%, #d7d2c4 100%)",
  "vs-gradient://half-zip": "linear-gradient(145deg, #111 0%, #2b2b2d 50%, #53687b 100%)",
  "vs-gradient://drop-tee": "linear-gradient(145deg, #0e0e0f 0%, #b46b43 48%, #f4efe7 100%)",
  "vs-gradient://jean-vintage": "linear-gradient(145deg, #1c2630 0%, #596c7f 54%, #c8b89f 100%)",
  "vs-gradient://rinonera": "linear-gradient(145deg, #111 0%, #66735c 52%, #b46b43 100%)"
};

type ProductVisualProps = {
  product: Pick<Product, "name" | "category" | "imageUrl" | "isDrop">;
  className?: string;
  priority?: "hero" | "card" | "wide";
};

export const ProductVisual = ({ product, className = "", priority = "card" }: ProductVisualProps) => {
  if (product.imageUrl && !product.imageUrl.startsWith("vs-gradient://")) {
    return <img className={`product-image ${className}`} src={product.imageUrl} alt={product.name} loading="lazy" />;
  }

  return (
    <div
      className={`product-visual product-visual--${priority} ${className}`}
      style={{ background: gradients[product.imageUrl] ?? gradients["vs-gradient://remera-essential"] }}
      aria-label={product.name}
      role="img"
    >
      <div className="visual-grid" />
      <div className="visual-copy">
        <span>{product.category}</span>
        <strong>{product.name}</strong>
      </div>
      {product.isDrop ? <div className="visual-stamp">DROP</div> : null}
    </div>
  );
};

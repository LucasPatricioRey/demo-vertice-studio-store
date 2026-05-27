import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectDatabase, isDbReady } from "./config/db";
import { env } from "./config/env";
import { Order } from "./models/Order";
import { Product } from "./models/Product";
import { User } from "./models/User";
import { seedProducts } from "./seedData";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

const seed = async () => {
  await connectDatabase();

  if (!isDbReady()) {
    console.warn("[seed] MONGODB_URI no configurado o sin conexion. No se modifico ninguna base.");
    return;
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

  await User.findOneAndUpdate(
    { email: env.ADMIN_EMAIL },
    {
      name: "Admin Demo",
      email: env.ADMIN_EMAIL,
      passwordHash,
      role: "admin"
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const savedProducts = [];

  for (const product of seedProducts) {
    const saved = await Product.findOneAndUpdate({ slug: product.slug }, product, {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    savedProducts.push(saved);
  }

  const existingOrders = await Order.countDocuments();

  if (existingOrders === 0) {
    const orderProducts = savedProducts.slice(0, 5);
    const demoOrders = [
      {
        customerName: "Martina Alvarez",
        customerPhone: "1155552031",
        customerNeighborhood: "Palermo",
        customerAddress: "Retiro en showroom",
        deliveryMethod: "showroom",
        notes: "Consulta por cambio de talle si el M queda amplio.",
        items: [
          {
            productId: orderProducts[0]._id,
            name: orderProducts[0].name,
            size: "M",
            color: "Negro",
            quantity: 1,
            price: orderProducts[0].price
          },
          {
            productId: orderProducts[4]?._id ?? orderProducts[0]._id,
            name: orderProducts[4]?.name ?? orderProducts[0].name,
            size: "Único",
            color: "Crudo",
            quantity: 1,
            price: orderProducts[4]?.price ?? orderProducts[0].price
          }
        ],
        status: "nuevo"
      },
      {
        customerName: "Santiago Torres",
        customerPhone: "1166557788",
        customerNeighborhood: "Villa Urquiza",
        customerAddress: "A coordinar por WhatsApp",
        deliveryMethod: "moto-caba",
        notes: "Prefiere entrega por la tarde.",
        items: [
          {
            productId: orderProducts[1]._id,
            name: orderProducts[1].name,
            size: "L",
            color: "Grafito",
            quantity: 1,
            price: orderProducts[1].price
          }
        ],
        status: "contactado"
      },
      {
        customerName: "Juli Paz",
        customerPhone: "1144449090",
        customerNeighborhood: "Rosario",
        customerAddress: "Envio a coordinar",
        deliveryMethod: "envio-interior",
        notes: "Pedir costo de envio antes de confirmar.",
        items: [
          {
            productId: orderProducts[3]._id,
            name: orderProducts[3].name,
            size: "M",
            color: "Azul acero",
            quantity: 1,
            price: orderProducts[3].price
          }
        ],
        status: "vendido"
      }
    ];

    for (const order of demoOrders) {
      const subtotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
      const whatsappMessage = `Hola Lucas, quiero consultar por un pedido de la demo Vértice Studio. Productos: ${order.items
        .map((item) => `${item.quantity}x ${item.name} talle ${item.size} color ${item.color}`)
        .join(" | ")}. Total estimado: ${currency.format(subtotal)}. Modalidad: ${order.deliveryMethod}. Nombre: ${
        order.customerName
      }.`;

      await Order.create({
        ...order,
        subtotal,
        whatsappMessage,
        source: "demo-web"
      });
    }
  }

  console.info(`[seed] Admin listo: ${env.ADMIN_EMAIL} / ${env.ADMIN_PASSWORD}`);
  console.info(`[seed] Productos creados/actualizados: ${savedProducts.length}`);
};

seed()
  .catch((error) => {
    console.error("[seed] Error al ejecutar seed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

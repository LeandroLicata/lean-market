/**
 * Carga stock en los productos.
 *
 * `stock` se agregó al schema con `@default(0)` después de haber cargado los
 * productos, así que quedaron todos en cero y ninguno se podía comprar. Este
 * script les pone una cantidad escalonada por precio, más realista que un
 * valor plano: muchos accesorios, pocas notebooks premium.
 *
 *   npm run seed:stock            solo los que están en 0
 *   npm run seed:stock -- --force recalcula todos, pisando el stock actual
 *
 * A propósito deja dos productos sin stock, para poder ver en la tienda el
 * estado "Sin stock" y el botón de agregar deshabilitado.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const force = process.argv.includes("--force");

/** Se mantienen en 0 para tener casos de "sin stock" en la tienda. */
const OUT_OF_STOCK = ["Asus ROG Zephyrus G14", "HP Omen 16"];

/**
 * Determinista a propósito: correrlo dos veces da el mismo resultado, así que
 * sirve como valor de referencia y no como sorteo.
 */
const stockFor = (price, index) => {
  if (price < 150) return 20 + (index % 3) * 4; // accesorios: 20, 24, 28
  if (price < 1000) return 10 + (index % 3) * 2; // gama media: 10, 12, 14
  return 4 + (index % 3); // premium: 4, 5, 6
};

const products = await prisma.products.findMany({
  orderBy: { price: "asc" },
  select: { id: true, name: true, price: true, stock: true },
});

const changes = [];

for (const [index, product] of products.entries()) {
  const target = OUT_OF_STOCK.includes(product.name)
    ? 0
    : stockFor(Number(product.price ?? 0), index);

  const shouldUpdate = force || product.stock === 0;
  if (!shouldUpdate || product.stock === target) continue;

  await prisma.products.update({
    where: { id: product.id },
    data: { stock: target },
  });

  changes.push({
    producto: product.name,
    precio: `$${product.price}`,
    antes: product.stock,
    ahora: target,
  });
}

if (changes.length === 0) {
  console.log("No había nada que actualizar.");
} else {
  console.table(changes);
  console.log(`${changes.length} producto(s) actualizado(s).`);
}

const remaining = await prisma.products.count({ where: { stock: 0 } });
console.log(`Productos sin stock: ${remaining} (esperados ${OUT_OF_STOCK.length}).`);

await prisma.$disconnect();

/**
 * Da o quita el rol de admin a un usuario ya registrado.
 *
 *   npm run make:admin -- tu@email.com
 *   npm run make:admin -- tu@email.com --quitar
 *
 * Solo los admin pueden crear o editar productos y marcas. No hay forma de
 * registrarse como admin: el primero se promueve con este script.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const quitar = args.includes("--quitar");
const email = args.find((a) => !a.startsWith("--"))?.trim().toLowerCase();

if (!email) {
  console.error("Falta el email. Ej: npm run make:admin -- tu@email.com");
  process.exit(1);
}

const user = await prisma.users.findUnique({ where: { email } });

if (!user) {
  console.error(`No existe ningún usuario con el email ${email}.`);
  console.error("Registrate primero en la app y volvé a correr esto.");
  process.exit(1);
}

const role = quitar ? "user" : "admin";

if (user.role === role) {
  console.log(`${email} ya tiene el rol "${role}". Nada que hacer.`);
} else {
  await prisma.users.update({ where: { email }, data: { role } });
  console.log(`${email}: ${user.role} → ${role}`);
}

const admins = await prisma.users.findMany({
  where: { role: "admin" },
  select: { email: true },
});
console.log(`Admins actuales: ${admins.map((a) => a.email).join(", ") || "ninguno"}`);

await prisma.$disconnect();

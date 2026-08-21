/**
 * Cambia la contraseña de un usuario ya registrado.
 *
 *   npm run set:password -- tu@email.com            (la pide por teclado)
 *   npm run set:password -- tu@email.com nuevaClave (queda en el historial del shell)
 *
 * Existe porque no hay recuperación de contraseña por email: es la forma de
 * volver a entrar a una cuenta cuya clave se perdió.
 */
import { createInterface } from "node:readline/promises";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const MIN = 8;
const prisma = new PrismaClient();

const [emailArg, passwordArg] = process.argv.slice(2);
const email = emailArg?.trim().toLowerCase();

if (!email) {
  console.error("Falta el email. Ej: npm run set:password -- tu@email.com");
  process.exit(1);
}

const user = await prisma.users.findUnique({ where: { email } });
if (!user) {
  console.error(`No existe ningún usuario con el email ${email}.`);
  process.exit(1);
}

let password = passwordArg;
if (!password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  password = await rl.question(`Nueva contraseña para ${email}: `);
  rl.close();
}

if (!password || password.length < MIN) {
  console.error(`La contraseña debe tener al menos ${MIN} caracteres.`);
  process.exit(1);
}

// Mismo costo que usa el registro, para que los hashes sean homogéneos.
await prisma.users.update({
  where: { email },
  data: { hashedPassword: await bcrypt.hash(password, 10) },
});

console.log(`Contraseña actualizada para ${email}. Ya podés iniciar sesión.`);
await prisma.$disconnect();

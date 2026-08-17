export const MIN_PASSWORD_LENGTH = 8;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normaliza el email antes de guardarlo o buscarlo.
 * Se usa tanto en el registro como en `authorize` de NextAuth: si cambia acá,
 * cambia en los dos lados a la vez.
 */
export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

/** Devuelve el mensaje de error, o `null` si la contraseña es válida. */
export const getPasswordError = (password: string) => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
  }
  return null;
};

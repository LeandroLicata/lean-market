"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { MIN_PASSWORD_LENGTH } from "@/lib/validation";

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const AuthForm = ({ isRegister }: { isRegister?: boolean }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Si llegamos acá desde una página protegida, volvemos a ella al autenticarnos.
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>();

  const password = watch("password");

  const showError = (text: string) => {
    Swal.fire({ title: "Error", text, icon: "error" });
  };

  const onSubmit = async (data: FormData) => {
    if (isRegister) {
      // Registro
      Swal.fire({
        title: "Registrando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await axios.post("/api/register", {
          email: data.email,
          password: data.password,
        });
      } catch (error) {
        Swal.close();
        showError(
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Ocurrió un error al registrarse"
        );
        return;
      }

      // Inicia sesión automáticamente después del registro
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      Swal.close();

      if (res?.error) {
        showError(
          "Tu cuenta se creó, pero no pudimos iniciar sesión. Probá ingresar manualmente."
        );
        router.push("/login");
        return;
      }

      router.push(callbackUrl);
      return;
    }

    // Login
    Swal.fire({
      title: "Iniciando sesión...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    Swal.close();

    if (res?.error) {
      showError("Credenciales inválidas");
      return;
    }

    router.push(callbackUrl);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block font-bold mb-1">Email</label>
        <input
          type="email"
          autoComplete="email"
          {...register("email", { required: "El email es obligatorio" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-1">Contraseña</label>
        <input
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          {...register("password", {
            required: "La contraseña es obligatoria",
            // Solo en el registro: en el login no adelantamos reglas de la contraseña.
            ...(isRegister && {
              minLength: {
                value: MIN_PASSWORD_LENGTH,
                message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
              },
            }),
          })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      {isRegister && (
        <div className="mb-4">
          <label className="block font-bold mb-1">Repetir contraseña</label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword", {
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isRegister ? "Registrarse" : "Iniciar sesión"}
      </button>
    </form>
  );
};

export default AuthForm;

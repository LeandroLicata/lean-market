"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const AuthForm = ({ isRegister }: { isRegister?: boolean }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const password = watch("password");

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
        await axios.post("/api/auth-custom/register", data);

        Swal.close();

        // Inicia sesión automáticamente después del registro
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        router.push("/");
      } catch (error) {
        Swal.fire({
          title: "Error",
          text:
            axios.isAxiosError(error) && error.response?.data?.message
              ? error.response.data.message
              : "Ocurrió un error al registrarse",
          icon: "error",
        });
      }
    } else {
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
        Swal.fire({
          title: "Error",
          text: "Credenciales inválidas",
          icon: "error",
        });
      } else {
        router.push("/");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block font-bold mb-1">Email</label>
        <input
          type="email"
          {...register("email", { required: "El email es obligatorio" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label className="block font-bold mb-1">Contraseña</label>
        <input
          type="password"
          {...register("password", {
            required: "La contraseña es obligatoria",
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isRegister ? "Registrarse" : "Iniciar sesión"}
      </button>
    </form>
  );
};

export default AuthForm;

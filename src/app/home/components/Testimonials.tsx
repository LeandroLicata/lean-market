// components/home/Testimonials.tsx
import Image from "next/image";

type Testimonial = {
  name: string;
  text: string;
  avatarUrl?: string;
};

const testimonials: Testimonial[] = [
  {
    name: "María González",
    text: "Excelente atención y los productos llegaron rapidísimo. ¡Recomiendo LeanMarket!",
    avatarUrl: "https://randomuser.me/api/portraits/women/74.jpg",
  },
  {
    name: "Lucas Pérez",
    text: "Muy buena experiencia de compra, encontré todo lo que buscaba a buen precio.",
    avatarUrl: "https://randomuser.me/api/portraits/men/50.jpg",
  },
  {
    name: "Camila Ríos",
    text: "Fácil de navegar, variedad de productos y excelente servicio postventa.",
    avatarUrl: "https://randomuser.me/api/portraits/women/77.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-8">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Lo que dicen nuestros clientes
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center"
          >
            {t.avatarUrl && (
              <Image
                src={t.avatarUrl}
                alt={`Avatar de ${t.name}`}
                width={64}
                height={64}
                className="rounded-full mb-4"
              />
            )}
            <p className="text-gray-700 italic">“{t.text}”</p>
            <p className="mt-4 font-medium text-deep-blue">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

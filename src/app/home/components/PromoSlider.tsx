"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCartIcon,
  TruckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const PromoSlider = () => {
  const slides = [
    {
      title: "¡Descuento del 50% en Electrónica!",
      description: "Aprovecha nuestras ofertas exclusivas por tiempo limitado.",
      bgColor: "bg-promo-1",
      icon: <ShoppingCartIcon  />, // Ícono para este slide
    },
    {
      title: "2x1 en accesorios tecnológicos",
      description: "Compra dos y paga uno en todos los accesorios.",
      bgColor: "bg-promo-2",
      icon: <SparklesIcon  />, // Ícono para este slide
    },
    {
      title: "Envío gratis en todas tus compras",
      description: "Solo válido hasta el domingo. ¡No te lo pierdas!",
      bgColor: "bg-promo-3",
      icon: <TruckIcon  />, // Ícono para este slide
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-64 overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`flex-shrink-0 w-full h-64 flex items-center justify-center ${slide.bgColor}`}
          >
            <div className="text-center text-primary">
              <div className="mb-4 w-16 h-16 mx-auto text-white">{slide.icon}</div>
              <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
              <p className="mt-2 text-lg">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        &#8594;
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;

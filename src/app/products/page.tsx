import { Suspense } from "react";
import ProductsClient from "./components/ProductsClient";

export default function Page() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="text-center mt-10">Cargando productos...</div>
        }
      >
        <ProductsClient />
      </Suspense>
    </div>
  );
}

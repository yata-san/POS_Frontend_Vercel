import { Suspense } from "react";
import ProductPageClient from "./ProductPageClient";

export default function Page() {
  return (
    <Suspense>
      <ProductPageClient />
    </Suspense>
  );
} 
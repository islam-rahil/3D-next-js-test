
import { Suspense } from "react";
import Home from "./Models";

export default function AgencyPage() {
  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  );
}
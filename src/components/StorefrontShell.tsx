"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import CostBreakupModal from "./CostBreakupModal";
import ARTryOnModal from "./ARTryOnModal";
import LiveRateSimulator from "./LiveRateSimulator";
import ScrollObserver from "./ScrollObserver";

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollObserver />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <CostBreakupModal />
      <ARTryOnModal />
      <LiveRateSimulator />
    </>
  );
}

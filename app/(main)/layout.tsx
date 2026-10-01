import type { ReactNode } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-accent/60">
      <Header />
      {children}
      <Footer />
    </main>
  );
}

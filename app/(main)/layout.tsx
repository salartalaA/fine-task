import type { ReactNode } from "react";
import Footer from "@/components/footer";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-accent/60">
      {children}
      <Footer />
    </main>
  );
}

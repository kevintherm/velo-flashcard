import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  direction?: number;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="w-full h-full flex flex-col min-h-screen bg-zinc-50">
      {children}
    </div>
  );
}

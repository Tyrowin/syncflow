"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// We intentionally avoid importing the singleton to allow tree-shaking if needed
// but re-use the same environment variable logic.
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Lazy singleton pattern (module scope) ensures single instance across renders.
const client = new ConvexReactClient(convexUrl || "");

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}

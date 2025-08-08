import React, { ReactNode } from "react";

// Lightweight mock implementations of Convex hooks for tests.
// We avoid importing real convex/react to prevent provider requirement.

export interface MockDataContextValue {
  queries: Record<string, unknown>;
  mutations?: Record<string, (...args: unknown[]) => unknown>;
}

const MockConvexContext = React.createContext<MockDataContextValue | null>(null);

export function ConvexTestProvider({
  children,
  queries,
  mutations,
}: {
  children: ReactNode;
  queries: Record<string, unknown>;
  mutations?: Record<string, (...args: unknown[]) => unknown>;
}) {
  return (
    <MockConvexContext.Provider value={{ queries, mutations: mutations || {} }}>
      {children}
    </MockConvexContext.Provider>
  );
}

// Hook facades mirroring convex/react signatures used in code.
export function useQuery(ref: unknown, args: unknown) {
  const ctx = React.useContext(MockConvexContext);
  if (!ctx) throw new Error("ConvexTestProvider missing");
  // Compose a key from function name + JSON args for deterministic lookup.
  const name = typeof ref === "string" ? ref : (ref as { name?: string } | null)?.name || "anon";
  const key = `${name}:${JSON.stringify(args || {})}`;
  return ctx.queries[key];
}

export function useMutation(ref: unknown) {
  const ctx = React.useContext(MockConvexContext);
  if (!ctx) throw new Error("ConvexTestProvider missing");
  const name = typeof ref === "string" ? ref : (ref as { name?: string } | null)?.name || "anon";
  return async (args: unknown) => {
    const fn = ctx.mutations?.[name];
    if (fn) return await fn(args);
    return undefined;
  };
}

import { ConvexReactClient } from "convex/react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!url) {
  // During early setup we allow empty, but log a clear warning in dev.
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "NEXT_PUBLIC_CONVEX_URL is not set. Run `npx convex dev` and copy the deployment URL into .env.local",
    );
  }
}

export const convex = new ConvexReactClient(url || "");

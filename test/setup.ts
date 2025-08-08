import "@testing-library/jest-dom";
import { Window } from "happy-dom";

// Create and assign a global DOM using happy-dom for Bun test environment.
const windowInstance = new Window();
// @ts-expect-error: happy-dom Window doesn't exactly match globalThis Window type
global.window = windowInstance as unknown as Window & typeof globalThis;
// @ts-expect-error: happy-dom provides a compatible document implementation
global.document = windowInstance.document;
// Provide basic navigator
// @ts-expect-error: minimal navigator shim for test environment
global.navigator = { userAgent: "node.js" };

// Provide a safe default Convex URL for any code that reads it during tests.
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  process.env.NEXT_PUBLIC_CONVEX_URL = "http://localhost:9393";
}

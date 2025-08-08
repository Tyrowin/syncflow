import "@testing-library/jest-dom";
import { Window } from "happy-dom";

// Create and assign a global DOM using happy-dom for Bun test environment.
const windowInstance = new Window();
// @ts-ignore augment globals
global.window = windowInstance as unknown as Window & typeof globalThis;
// @ts-ignore
global.document = windowInstance.document;
// Provide basic navigator
// @ts-ignore
global.navigator = { userAgent: "node.js" };

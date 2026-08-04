import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import z from "zod";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      throwOnError: (error) => {
        if (isNetworkError(error)) {
          console.log("Network error: ", error);
          return false;
        }
        if (error instanceof z.ZodError) {
          console.log("Zod error inside ReactQuery: ", error.issues);
          return false;
        }
        console.log(error);
        return false;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);

const networkErrorMessages = [
  "failed to fetch",
  "network error",
  "fetch failed",
];

function isNetworkError(error: Error) {
  // Step 1: Filter non-TypeErrors
  if (!(error instanceof TypeError)) return false;

  // Step 2: Check modern browser cause property
  const cause = error.cause;
  if (cause && typeof cause === "object" && "name" in cause) {
    return cause.name === "NetworkError" || !navigator.onLine;
  }

  // Step 3: Legacy fallback for error messages
  const message = error.message.toLowerCase();
  return networkErrorMessages.some((phrase) => message.includes(phrase));
}

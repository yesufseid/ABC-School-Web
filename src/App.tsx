import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router/dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import { router } from "./app/routes/router";
import { Suspense, useEffect, useState } from "react";

const queryClient = new QueryClient();

function App() {
  const [showDevTools, setShowDevTools] = useState(false);

  useEffect(() => {
    // @ts-expect-error - the window global object can get a new propoerty assigned to it
    window.toggleDevTools = () => setShowDevTools((prev) => !prev);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {showDevTools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;

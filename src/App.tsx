import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { router } from "@/app/routes/router";
import { Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  const [showDevTools, setShowDevTools] = useState(false);

  useEffect(() => {
    // @ts-expect-error - the window global object can get a new propoerty assigned to it
    window.toggleDevTools = () => setShowDevTools((prev) => !prev);
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />

        {showDevTools && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}

        <Toaster />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;

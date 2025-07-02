import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { store, persistor } from "./common/store/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "./common/context/theme/theme-provider.jsx";
import { ErrorBoundary } from "./app/error/error-boundary/page.jsx";
import { LoaderProvider } from "./common/context/loader/loader-provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider>
            <LoaderProvider>
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </LoaderProvider>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);

import { RouterProvider } from "react-router-dom";
import { BackdropProvider, Providers, ToastProvider } from "./components";
import routes from "./pages/router";

function App() {
  return (
    <Providers>
      <RouterProvider router={routes} />
      <ToastProvider />
      <BackdropProvider />
    </Providers>
  );
}

export default App;

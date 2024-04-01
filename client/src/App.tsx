import { RouterProvider } from "react-router-dom";
import { BackdropProvider, Providers, ToastProvider } from "./components";
import routes from "./pages/router";

/**
 * Only for UI testing
 */
// @ts-ignore
function _Playground() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <h1>Playground</h1>
    </div>
  );
}

function App() {
  return (
    <Providers>
      <RouterProvider router={routes} />
      <ToastProvider />
      <BackdropProvider />

      {/* <_Playground /> */}
    </Providers>
  );
}

export default App;

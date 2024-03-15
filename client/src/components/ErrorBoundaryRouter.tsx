import ErrorPage from "@/pages/error.page";
import { useRouteError } from "react-router-dom";

export default function ErrorBoundaryRouter() {
  let error = useRouteError() as Error | undefined;

  return <ErrorPage error={error} />;
}

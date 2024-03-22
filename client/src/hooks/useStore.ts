import { StoreContext } from "@/context/store";
import { useContext } from "react";

import AppError, { AppErrorKind } from "@/libs/exceptions";

export function useStore() {
  const ctx = useContext(StoreContext);

  if (!ctx) {
    throw AppError.new(
      AppErrorKind.InvalidInputError,
      "useStore must provide",
    );
  }

  return ctx;
}

import { StoreContext } from "@/context/store";
import { AppError } from "@/libs/exceptions";
import { useContext } from "react";

export function useStore() {
  const ctx = useContext(StoreContext)

  if (!ctx) throw AppError.InvalidInputError("useStore must provide")

  return ctx
}

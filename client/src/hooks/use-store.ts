import { StoreContext } from "@/context/store";
import { useContext } from "react";

export function useStore() {
  const ctx = useContext(StoreContext)

  if (!ctx) throw new Error("useStore must provide")

  return ctx
}

import { SuspenseLoader } from "@/components"
import { ComponentType, LazyExoticComponent, Suspense } from "react"

export default function Loader<P extends {}>(Component: LazyExoticComponent<ComponentType<P>>) {
  return (props: any) => {
    return <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  }
}

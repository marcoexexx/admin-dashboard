import { ComponentType, LazyExoticComponent, Suspense } from "react"

export default function Loader<P extends {}>(Component: LazyExoticComponent<ComponentType<P>>) {
  return (props: any) => {
    return <Suspense fallback={<h1>Loading ...</h1>}>
      <Component {...props} />
    </Suspense>
  }
}

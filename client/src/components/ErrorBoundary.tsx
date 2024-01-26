import ErrorPage from "@/pages/error.page";
import { Component, ErrorInfo, ReactNode } from "react";


interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: undefined
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error: ", error, errorInfo)
    this.setState({ error })
  }

  render(): ReactNode {
    if (!!this.state.error) return <ErrorPage error={this.state.error} />
    return this.props.children
  }
}

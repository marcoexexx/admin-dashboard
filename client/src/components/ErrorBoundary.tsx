import { AppError } from "@/libs/exceptions";
import ErrorPage from "@/pages/error.page";
import Unauthorized from "@/pages/unauthorized.page";
import { Component, ErrorInfo, ReactNode } from "react";


interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  error?: Error
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
    if (!!this.state.error) {
      if (this.state.error instanceof AppError.PermissionError.cls) return <Unauthorized />
      return <ErrorPage error={this.state.error} />
    }
    return this.props.children
  }
}

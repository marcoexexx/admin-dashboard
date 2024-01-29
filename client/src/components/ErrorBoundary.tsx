import { Component, ErrorInfo, ReactNode } from "react";

import ErrorPage from "@/pages/error.page";
import Unauthorized from "@/pages/unauthorized.page";
import AppError, { AppErrorKind } from "@/libs/exceptions";


interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  error?: Error | AppError
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: undefined
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error })
    console.error("ErrorBoundary caught an error: ", error, errorInfo)
  }

  render(): ReactNode {
    if (!!this.state.error) {
      // Handle AppError
      if (this.state.error instanceof AppError) {
        switch (this.state.error.kind) {
          case AppErrorKind.NetworkError: return <ErrorPage error={this.state.error} />
          case AppErrorKind.ApiError: return <ErrorPage error={this.state.error} />
          case AppErrorKind.InvalidInputError: return <ErrorPage error={this.state.error} />
          case AppErrorKind.PermissionError: return <Unauthorized />

          default: {
            const _unreachable: never = this.state.error.kind
            console.error({ _unreachable })
            return <ErrorPage error={this.state.error} />
          }
        }
      // Handle Error
      } else {
        return <ErrorPage error={this.state.error} />
      }
    }
    return this.props.children
  }
}

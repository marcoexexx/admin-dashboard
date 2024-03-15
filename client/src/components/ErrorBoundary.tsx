import AppError, { AppErrorKind } from "@/libs/exceptions";

import { Component, ErrorInfo, ReactNode } from "react";
import { MiniAccessDenied } from "./MiniAccessDenied";

import BlockedUserErrorPage from "@/pages/blockedUserError.page";
import ErrorPage from "@/pages/error.page";
import InvalidAuthSessionPage from "@/pages/invalidAuthSession.page";
import UnderTheMaintenance from "@/pages/maintenance.page";
import Unauthorized from "@/pages/unauthorized.page";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error?: Error | AppError;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error });
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
  }

  render(): ReactNode {
    if (!!this.state.error) {
      // Handle AppError
      if (this.state.error instanceof AppError) {
        switch (this.state.error.kind) {
          case AppErrorKind.NetworkError:
            return <h1>NetworkError: Please check your internet connection</h1>;
          case AppErrorKind.ApiError:
            return <ErrorPage error={this.state.error} />;
          case AppErrorKind.InvalidInputError:
            return <ErrorPage error={this.state.error} />;
          case AppErrorKind.PermissionError:
            return <Unauthorized />;
          case AppErrorKind.NoDataError:
            return <ErrorPage error={this.state.error} />;
          case AppErrorKind.AccessDeniedError:
            return <MiniAccessDenied />;
          case AppErrorKind.UnderTheMaintenance:
            return <UnderTheMaintenance message={this.state.error.message} />;
          case AppErrorKind.InvalidAuthSession:
            return <InvalidAuthSessionPage />;
          case AppErrorKind.BlockedUserError:
            return <BlockedUserErrorPage />;
          case AppErrorKind.ServiceUnavailable:
            return <h1>Service not available right now</h1>;

          default: {
            const _unreachable: never = this.state.error.kind;
            console.error({ _unreachable });
            return <ErrorPage error={this.state.error} />;
          }
        }
        // Handle Error
      } else {
        return <ErrorPage error={this.state.error} />;
      }
    }
    return this.props.children;
  }
}

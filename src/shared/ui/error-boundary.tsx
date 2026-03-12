import type { ReactNode } from 'react';
import { Component } from 'react';

export interface ErrorBoundaryProps {
  /** UI subtree to protect. */
  children: ReactNode;
  /** Optional fallback UI when an error is caught. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Minimal React Error Boundary to prevent a single widget/page crash
 * from taking down the whole app.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(): void {
    // Intentionally no side effects here; errors are already captured globally (Sentry wrapper in main.tsx).
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <p className="text-sm text-destructive">
            Something went wrong. Please try again.
          </p>
        )
      );
    }
    return this.props.children;
  }
}


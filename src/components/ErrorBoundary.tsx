import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReset = () => {
    (this as any).setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if ((this as any).state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        if ((this as any).state.error?.message) {
          const parsed = JSON.parse((this as any).state.error.message);
          if (parsed.operationType) {
            isFirestoreError = true;
            errorMessage = `Database error during ${parsed.operationType} on ${parsed.path || 'unknown path'}.`;
          }
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Oops! Something went wrong</h2>
              <p className="text-muted-foreground">
                {isFirestoreError ? "We encountered a permission or data issue with our database." : errorMessage}
              </p>
            </div>
            
            {isFirestoreError && (
              <div className="p-4 bg-muted rounded-xl text-xs font-mono text-left overflow-auto max-h-32">
                {(this as any).state.error?.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={this.handleReset} className="flex-1 gap-2">
                <RefreshCw className="w-4 h-4" /> Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'} className="flex-1 gap-2">
                <Home className="w-4 h-4" /> Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

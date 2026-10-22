import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, errorMessage: '' };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('EventPulse AI Runtime Error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div role="alert" aria-live="assertive" className="p-8 text-center">
          <h2 className="text-xl font-bold">Something went wrong in EventPulse AI</h2>
          <p className="text-sm text-slate-600 mt-2">{this.state.errorMessage}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

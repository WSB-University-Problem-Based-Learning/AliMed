import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  translations?: {
    somethingWentWrong: string;
    unexpectedError: string;
    technicalDetails: string;
    backToHome: string;
  };
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Default translations (Polish)
const defaultTranslations = {
  somethingWentWrong: 'Coś poszło nie tak',
  unexpectedError: 'Przepraszamy, wystąpił nieoczekiwany błąd podczas ładowania aplikacji.',
  technicalDetails: 'Szczegóły techniczne',
  backToHome: 'Powrót do strony głównej',
};

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const t = this.props.translations || defaultTranslations;

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.somethingWentWrong}</h2>
            <p className="text-gray-600 mb-6">
              {t.unexpectedError}
            </p>
            {this.state.error && (
              <details className="text-left mb-6 p-4 bg-gray-50 rounded text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  {t.technicalDetails}
                </summary>
                <code className="text-xs text-red-600 block overflow-auto">
                  {this.state.error.message}
                </code>
              </details>
            )}
            <button
              onClick={() => window.location.href = '/'}
              className="bg-alimed-blue text-white px-6 py-3 rounded-lg hover:bg-alimed-light-blue transition font-medium"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

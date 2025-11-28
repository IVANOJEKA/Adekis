import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                    <div className="bg-red-100 p-4 rounded-full mb-4">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h2>
                    <p className="text-slate-600 mb-6 max-w-md">
                        We encountered an unexpected error while loading this module. This might be due to a network issue or a temporary glitch.
                    </p>

                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="mb-6 p-4 bg-red-50 text-left rounded-lg border border-red-100 w-full max-w-2xl overflow-auto max-h-48">
                            <p className="font-mono text-xs text-red-700 whitespace-pre-wrap">
                                {this.state.error.toString()}
                            </p>
                            {this.state.errorInfo && (
                                <pre className="font-mono text-xs text-red-600 mt-2 whitespace-pre-wrap">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </div>
                    )}

                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-lg shadow-primary/30"
                    >
                        <RefreshCw size={18} />
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

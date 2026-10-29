import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Enterprise-grade React Error Boundary
 * Traps runtime errors anywhere in the component tree and displays a graceful fallback.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="min-h-[400px] flex items-center justify-center p-6 bg-slate-900 border border-rose-900/40 rounded-2xl my-8 text-center"
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong in this module</h2>
            <p className="text-xs text-slate-400">
              The application encountered an unexpected state. Our resilient fallback protocols have prevented the full application from terminating.
            </p>
            {this.state.error && (
              <pre className="text-[11px] bg-slate-950 p-3 rounded-lg text-rose-300 font-mono text-left overflow-auto max-h-32 border border-slate-800">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/40 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Module</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

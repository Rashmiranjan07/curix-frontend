import React from 'react';
import { AlertCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Curix ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex items-center justify-center p-6 bg-[#F4F8FB]">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-xl border border-rose-100 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-[#0A1C35] font-['Outfit'] mb-2">
              Clinical Portal Alert
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
              An unexpected render issue was safely intercepted in this view. Your session and patient data remain secure.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-mono text-slate-700 max-h-32 overflow-y-auto">
                <span className="font-semibold text-rose-600 block mb-1">Diagnostics:</span>
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00A896] hover:bg-[#008f80] text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#00A896]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retry View
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0A1C35] hover:bg-[#112d53] text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#0A1C35]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

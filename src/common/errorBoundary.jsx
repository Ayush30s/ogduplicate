// components/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🔴 Frontend Crash:", error, errorInfo);
    // Optionally send to Sentry or a logging service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-400 text-center py-10">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <p>
            {this.state.error?.message || "Please try refreshing the page."}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

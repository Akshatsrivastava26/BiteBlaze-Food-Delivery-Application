import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error("Unhandled UI error:", error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fff9f6] p-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-[#7F00FF] mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-5">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              className="bg-[#7F00FF] text-white px-4 py-2 rounded-lg hover:bg-[#6500CC] transition-colors cursor-pointer"
              onClick={this.handleReload}
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


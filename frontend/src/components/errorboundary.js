import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #66B2FF 0%, #002C54 100%)'}}>
          <div className="text-center">
            <div className="text-6xl mb-4">💥</div>
            <p className="text-white text-xl font-bold mb-4">Something went wrong!</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold hover:opacity-80"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service like Sentry
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#111',
                    color: 'white',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ color: '#ff4757', marginBottom: '10px' }}>Oops! Something went wrong.</h2>
                    <p style={{ color: '#aaa', marginBottom: '20px' }}>We're working on fixing this right away.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: '#ff4757',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        🔄 Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

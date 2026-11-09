import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const App = React.lazy(() => import('./App'));
const RemoteApp = React.lazy(() => import('./remote/RemoteApp'));

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

// Detect if this is the mobile phone remote controller route
const isRemoteRoute =
  window.location.pathname.startsWith('/remote') ||
  window.location.hash.startsWith('#/remote') ||
  window.location.search.includes('view=remote');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <div className="w-screen h-screen flex items-center justify-center bg-gray-950 text-gray-400 font-sans text-sm">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span>Loading {isRemoteRoute ? 'Remote' : 'Dashboard'}...</span>
          </div>
        </div>
      }
    >
      {isRemoteRoute ? <RemoteApp /> : <App />}
    </Suspense>
  </React.StrictMode>
);

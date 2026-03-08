import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import { AuthProvider } from './utils/auth/auth';
import InnerApp, { createAppRouter } from './inner-app';

const queryClient = new QueryClient();
const router = createAppRouter(queryClient);
const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

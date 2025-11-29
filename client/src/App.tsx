import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/section/home';
import LoginPage from './pages/auth/login-page';
import RegisterPage from './pages/auth/register-page';
import DashboardPage from './pages/dashboard/dashboard-page';
import OAuthSuccessPage from './pages/auth/oauth-success-page';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/auth-context';
import ProtectedRoutes from './components/additional/protected-routes';
import { Toaster } from './components/ui/sonner';
import InitForgetPasswordPage from './pages/auth/init-forget-page';
import ForgetPasswordPage from './pages/auth/new-password-page-token';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <BrowserRouter>
        <Toaster richColors />{' '}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route
            path="/auth/init-password-forget"
            element={<InitForgetPasswordPage />}
          />
          <Route
            path="/auth/password-forget/:token"
            element={<ForgetPasswordPage />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                {' '}
                <DashboardPage />{' '}
              </ProtectedRoutes>
            }
          />
          <Route path="/oauth/success" element={<OAuthSuccessPage />} />{' '}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </QueryClientProvider>
);

export default App;

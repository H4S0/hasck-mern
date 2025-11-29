import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/section/home';
import LoginPage from './pages/auth/login-page';
import RegisterPage from './pages/auth/register-page';
import DashboardPage from './pages/dashboard/dashboard-page';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/auth-context';
import ProtectedRoutes from './components/additional/protected-routes';
import { Toaster } from './components/ui/sonner';
import InitForgetPasswordPage from './pages/auth/init-forget-page';
import ForgetPasswordPage from './pages/auth/new-password-page-token';
import SuccessPage from './pages/auth/oauth/success-page';

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
          <Route path="/oauth/success" element={<SuccessPage />} />{' '}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </QueryClientProvider>
);

export default App;

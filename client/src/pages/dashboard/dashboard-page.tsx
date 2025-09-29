import { Navbar } from '@/components/additional/navbar';
import PasswordResetForm from '@/components/forms/password-reset-form';
import UpdateEmailForm from '@/components/forms/update-email-form';

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6 mt-20">
          <UpdateEmailForm />
          <PasswordResetForm />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

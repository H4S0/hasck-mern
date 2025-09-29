import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import LogoutButton from './logout-button';
import { useUser } from '@/context/auth-context';

export const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="w-full py-3 md:py-4 px-4 md:px-6 border-b border-transparent bg-background/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-lg md:text-xl font-bold text-primary">
          Hasck
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <LogoutButton />
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-sm md:text-base"
              >
                <Link to="/auth/login">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="text-sm md:text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Link to="/auth/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <Separator className="w-full my-4" />
    </nav>
  );
};

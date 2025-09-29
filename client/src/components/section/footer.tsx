import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="py-8 md:py-12 border-t bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-bold text-primary">
              Hasck
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Modern Authentication for MERN stack
            </p>
          </div>
          <div className="flex gap-4 md:gap-6">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              to="/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

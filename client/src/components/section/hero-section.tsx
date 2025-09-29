import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 md:px-6 text-center pt-32 md:pt-32 pb-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl md:blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-48 h-48 md:w-72 md:h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl md:blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-8 left-1/2 w-48 h-48 md:w-72 md:h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl md:blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl md:max-w-4xl mx-auto mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 px-2">
          Modern Authentication for <span className="text-primary">MERN</span>
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-xs sm:max-w-md md:max-w-2xl mx-auto mb-6 md:mb-8 px-2">
          Hasck provides a clean, modern authentication template for your MERN
          stack projects. Start building secure applications in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-2">
          <Button
            asChild
            size="lg"
            className="text-sm md:text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
          >
            <Link to="/auth/register">Get Started →</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-sm md:text-base border-2 hover:bg-background/50 backdrop-blur-sm"
          >
            <Link to="/auth/login">Explore Features</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

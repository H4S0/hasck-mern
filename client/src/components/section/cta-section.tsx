import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-30"></div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          Get Started
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Ready to Transform Your Authentication?
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8">
          Join thousands of developers who have streamlined their auth workflow
          with Hasck
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
          >
            <Link to="/auth/register">Start Building Now →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

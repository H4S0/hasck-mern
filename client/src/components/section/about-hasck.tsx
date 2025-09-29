import { FeatureCard } from '../additional/feature-card';

export const AboutHasck = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/10 relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white_10%,transparent_70%)] opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">Hasck</span>?
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            A complete authentication solution designed for modern MERN
            applications
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <FeatureCard
            icon={
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            }
            title="Modern Stack"
            description="Built with Mongo, Express, React and NodeJS for a modern development experience."
          />

          <FeatureCard
            icon={
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            }
            title="Secure Authentication"
            description="Industry-standard security practices with JWT tokens and secure password handling."
          />

          <FeatureCard
            icon={
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                ></path>
              </svg>
            }
            title="Ready to Scale"
            description="Built with scalability in mind, perfect for projects of any size."
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-4 md:p-6 bg-background/80 backdrop-blur-sm rounded-lg md:rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
      {icon}
    </div>
    <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{title}</h3>
    <p className="text-sm md:text-base text-muted-foreground">{description}</p>
  </div>
);

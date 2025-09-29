import { Navbar } from '../additional/navbar';
import { HeroSection } from './hero-section';
import { AboutHasck } from './about-hasck';
import { CtaSection } from './cta-section';
import { Footer } from './footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <AboutHasck />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Home;

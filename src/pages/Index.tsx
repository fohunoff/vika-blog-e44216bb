
import { useEffect } from 'react';
import BlogHeader from '../components/BlogHeader';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import LatestPosts from '../components/LatestPosts';
import AboutSection from '../components/AboutSection';
import NewsletterSection from '../components/NewsletterSection';
import Footer from '../components/Footer';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen">
      <BlogHeader />
      <HeroSection />
      <CategorySection />
      <LatestPosts />
      <AboutSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
};

export default Index;

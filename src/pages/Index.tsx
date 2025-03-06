
import { useEffect } from 'react';
import BlogHeader from '../components/BlogHeader';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import LatestPosts from '../components/home/LatestPosts';
import AboutSection from '../components/home/AboutSection';
import NewsletterSection from '../components/home/NewsletterSection';
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

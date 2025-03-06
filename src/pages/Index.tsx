
import { useEffect } from 'react';
import BlogHeader from '../components/BlogHeader';
import HeroSection from '../components/main/HeroSection.tsx';
import CategorySection from '../components/main/CategorySection.tsx';
import LatestPosts from '../components/main/LatestPosts.tsx';
import AboutSection from '../components/main/AboutSection.tsx';
import NewsletterSection from '../components/main/NewsletterSection.tsx';
import BlogFooter from '../components/BlogFooter';

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
      <BlogFooter />
    </main>
  );
};

export default Index;

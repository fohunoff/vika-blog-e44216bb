
import { Metadata } from 'next';
import Link from 'next/link';
import BlogHeader from '@/components/BlogHeader';
import Footer from '@/components/Footer';
import HeroSection from '@/components/main/HeroSection';
import CategorySection from '@/components/main/CategorySection';
import LatestPosts from '@/components/main/LatestPosts';
import AboutSection from '@/components/main/AboutSection';
import NewsletterSection from '@/components/main/NewsletterSection';

export const metadata: Metadata = {
  title: 'Главная | Мой блог',
  description: 'Мой персональный блог о жизни, творчестве и интересных открытиях',
};

export default function HomePage() {
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
}

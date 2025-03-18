
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchAPI } from '@/nextjs-migration/lib/api';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import HeroSection from '@/nextjs-migration/components/main/HeroSection';
import CategorySection from '@/nextjs-migration/components/main/CategorySection';
import LatestPostsSection from '@/nextjs-migration/components/main/LatestPostsSection';
import AboutSection from '@/nextjs-migration/components/main/AboutSection';
import NewsletterSection from '@/nextjs-migration/components/main/NewsletterSection';

export const metadata: Metadata = {
  title: 'Главная | Мой блог',
  description: 'Мой персональный блог о жизни, творчестве и интересных открытиях',
};

// Функции для получения данных
async function getHeroData() {
  return fetchAPI('/main/hero');
}

async function getCategories() {
  return fetchAPI('/main/categories');
}

async function getLatestPosts() {
  return fetchAPI('/main/latest-posts');
}

async function getAboutData() {
  return fetchAPI('/main/about');
}

async function getNewsletterData() {
  return fetchAPI('/main/newsletter');
}

export default async function HomePage() {
  // Получаем данные с сервера
  const [heroData, categories, latestPosts, aboutData, newsletterData] = await Promise.all([
    getHeroData().catch(() => null),
    getCategories().catch(() => []),
    getLatestPosts().catch(() => []),
    getAboutData().catch(() => null),
    getNewsletterData().catch(() => null)
  ]);

  return (
    <MainLayout>
      <HeroSection data={heroData} />
      
      <CategorySection categories={categories} />
      
      <LatestPostsSection posts={latestPosts} />
      
      <AboutSection data={aboutData} />
      
      <NewsletterSection data={newsletterData} />
    </MainLayout>
  );
}


import { Metadata } from 'next';
import { fetchAPI } from '@/nextjs-migration/lib/api';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import HeroSection from '@/nextjs-migration/components/main/HeroSection';
import CategorySection from '@/nextjs-migration/components/main/CategorySection';
import LatestPostsSection from '@/nextjs-migration/components/main/LatestPostsSection';
import AboutSection from '@/nextjs-migration/components/main/AboutSection';
import NewsletterSection from '@/nextjs-migration/components/main/NewsletterSection';
import { HeroData, Category, AboutData, NewsletterData, LatestPost } from '@/types/main';

export const metadata: Metadata = {
  title: 'Главная | Мой блог',
  description: 'Мой персональный блог о жизни, творчестве и интересных открытиях',
};

// Default data objects to use as fallbacks
const defaultHero: HeroData = {
  title: 'Блог о жизни<br/>и вдохновении',
  subtitle: 'Рецепты, интересные места и много полезных идей',
  buttonText: 'Смотреть записи',
  buttonLink: '/diary',
  imageUrl: '/placeholder.svg'
};

const defaultAbout: AboutData = {
  title: 'О <span class="text-blog-yellow">блоге</span>',
  paragraphs: [
    'Добро пожаловать в мой персональный блог! Здесь я делюсь своими мыслями, впечатлениями и идеями о жизни, еде, путешествиях и создании уюта.',
    'Моя цель — вдохновлять и делиться полезной информацией. Надеюсь, вы найдете здесь что-то интересное для себя!'
  ],
  buttonText: 'Узнать больше',
  buttonLink: '/about',
  image: '/placeholder.svg',
  imageAlt: 'Фото автора'
};

const defaultNewsletter: NewsletterData = {
  title: 'БУДЬТЕ В КУРСЕ',
  description: 'Подпишитесь на мою рассылку, чтобы первыми узнавать о новых рецептах, местах и идеях.',
  inputPlaceholder: 'Ваш email',
  successMessage: 'Спасибо за подписку!'
};

// Функции для получения данных
async function getHeroData(): Promise<HeroData> {
  return fetchAPI('/main/hero');
}

async function getCategories(): Promise<Category[]> {
  return fetchAPI('/main/categories');
}

async function getLatestPosts(): Promise<LatestPost[]> {
  return fetchAPI('/main/latest-posts');
}

async function getAboutData(): Promise<AboutData> {
  return fetchAPI('/main/about');
}

async function getNewsletterData(): Promise<NewsletterData> {
  return fetchAPI('/main/newsletter');
}

export default async function HomePage() {
  // Получаем данные с сервера
  const [heroData, categories, latestPosts, aboutData, newsletterData] = await Promise.all([
    getHeroData().catch(() => defaultHero),
    getCategories().catch(() => [] as Category[]),
    getLatestPosts().catch(() => [] as LatestPost[]),
    getAboutData().catch(() => defaultAbout),
    getNewsletterData().catch(() => defaultNewsletter)
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

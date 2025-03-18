
import { Metadata } from 'next';
import { fetchAPI } from '@/nextjs-migration/lib/api';
import MainLayout from '@/nextjs-migration/components/layout/MainLayout';
import HeroSection from '@/nextjs-migration/components/main/HeroSection';
import CategorySection from '@/nextjs-migration/components/main/CategorySection';
import LatestPostsSection from '@/nextjs-migration/components/main/LatestPostsSection';
import AboutSection from '@/nextjs-migration/components/main/AboutSection';
import NewsletterSection from '@/nextjs-migration/components/main/NewsletterSection';
import { LatestPost, Category as MainCategory, AboutData as MainAboutData } from '@/types/main';

// Import the types expected by the components
interface ComponentHeroData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
}

interface ComponentNewsletterData {
  title: string;
  description: string;
  buttonText: string;
  placeholderText: string;
}

export const metadata: Metadata = {
  title: 'Главная | Мой блог',
  description: 'Мой персональный блог о жизни, творчестве и интересных открытиях',
};

// Default data objects to use as fallbacks
const defaultHero: ComponentHeroData = {
  title: 'Блог о жизни<br/>и вдохновении',
  subtitle: 'Рецепты, интересные места и много полезных идей',
  buttonText: 'Смотреть записи',
  buttonLink: '/diary',
  imageUrl: '/placeholder.svg'
};

const defaultAbout: MainAboutData = {
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

const defaultNewsletter: ComponentNewsletterData = {
  title: 'БУДЬТЕ В КУРСЕ',
  description: 'Подпишитесь на мою рассылку, чтобы первыми узнавать о новых рецептах, местах и идеях.',
  buttonText: 'Подписаться',
  placeholderText: 'Ваш email'
};

// Adapting API data to component data structures
function adaptCategoryData(categories: MainCategory[]): any[] {
  return categories.map(category => ({
    ...category,
    bgColor: 'bg-blog-yellow', // Add default bgColor
  }));
}

function adaptPostsData(posts: LatestPost[]): any[] {
  return posts.map(post => ({
    ...post,
    image: post.imageSrc || '/placeholder.svg', // Map imageSrc to image
  }));
}

// Функции для получения данных
async function getHeroData() {
  return fetchAPI('/main/hero').then(data => ({
    title: data.title || defaultHero.title,
    subtitle: data.description || defaultHero.subtitle,
    buttonText: data.primaryButton?.text || defaultHero.buttonText,
    buttonLink: data.primaryButton?.link || defaultHero.buttonLink,
    imageUrl: data.mainImage?.src || defaultHero.imageUrl
  })).catch(() => defaultHero);
}

async function getCategories() {
  return fetchAPI('/main/categories').then(data => adaptCategoryData(data)).catch(() => [] as any[]);
}

async function getLatestPosts() {
  return fetchAPI('/main/latest-posts').then(data => adaptPostsData(data)).catch(() => [] as any[]);
}

async function getAboutData() {
  return fetchAPI('/main/about').catch(() => defaultAbout) as Promise<MainAboutData>;
}

async function getNewsletterData() {
  return fetchAPI('/main/newsletter').then(data => ({
    title: data.title || defaultNewsletter.title,
    description: data.description || defaultNewsletter.description,
    buttonText: 'Подписаться',
    placeholderText: 'Ваш email'
  })).catch(() => defaultNewsletter);
}

export default async function HomePage() {
  // Получаем данные с сервера
  const [heroData, categories, latestPosts, aboutData, newsletterData] = await Promise.all([
    getHeroData(),
    getCategories(),
    getLatestPosts(),
    getAboutData(),
    getNewsletterData()
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

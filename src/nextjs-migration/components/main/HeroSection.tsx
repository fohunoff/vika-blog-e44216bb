
import Link from 'next/link';
import Image from 'next/image';

export interface HeroData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
}

interface HeroSectionProps {
  data: HeroData | null;
}

const defaultHero = {
  title: 'Блог о жизни<br/>и вдохновении',
  subtitle: 'Рецепты, интересные места и много полезных идей',
  buttonText: 'Смотреть записи',
  buttonLink: '/diary',
  imageUrl: '/placeholder.svg'
};

const HeroSection = ({ data }: HeroSectionProps) => {
  const hero = data || defaultHero;

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          <Image
            src={hero.imageUrl}
            alt="Hero background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
      </div>
      
      <div className="blog-container relative z-10 text-white">
        <div className="max-w-2xl animate-fade-up">
          <h1 
            className="text-5xl md:text-7xl font-black mb-6"
            dangerouslySetInnerHTML={{ __html: hero.title }}
          ></h1>
          <p className="text-xl mb-8 text-white/90">
            {hero.subtitle}
          </p>
          <Link 
            href={hero.buttonLink} 
            className="inline-block bg-blog-yellow text-blog-black px-8 py-4 rounded-full hover:bg-blog-yellow-dark transition-colors font-medium"
          >
            {hero.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

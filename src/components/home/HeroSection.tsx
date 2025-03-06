
import { ArrowDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

interface HeroData {
  tagline: string;
  title: string;
  description: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
  mainImage: {
    src: string;
    alt: string;
  };
  badge: {
    text: string;
  };
  imageCaption: {
    title: string;
    subtitle: string;
  };
}

const HeroSection = () => {
  const { api } = useApi();
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await api.home.getHeroData();
        setHeroData(data);
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroData();
  }, [api.home]);

  const scrollToContent = () => {
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading || !heroData) {
    return <div className="min-h-screen bg-blog-yellow flex items-center justify-center">Загрузка...</div>;
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blog-yellow to-blog-yellow-light flex items-center">
      <div className="absolute inset-0 bg-[url('/img/pattern.svg')] bg-repeat opacity-15"></div>
      
      <div className="blog-container relative z-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-blog-black text-blog-white px-4 py-2 rounded-full mb-8 animate-fade-in">
              <Sparkles size={16} />
              <span className="text-sm font-medium">{heroData.tagline}</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl uppercase font-black tracking-tighter mb-6" 
                dangerouslySetInnerHTML={{ __html: heroData.title }}>
            </h1>
            
            <p className="text-xl mb-10 max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {heroData.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to={heroData.primaryButton.link}
                className="inline-flex items-center gap-2 bg-blog-black text-blog-white px-8 py-4 rounded-full hover:bg-opacity-90 transition-all animate-fade-in"
                style={{ animationDelay: '0.3s' }}
              >
                {heroData.primaryButton.text}
              </Link>
              <Link 
                to={heroData.secondaryButton.link}
                className="inline-flex items-center gap-2 bg-white text-blog-black px-8 py-4 rounded-full hover:bg-opacity-90 transition-all animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                {heroData.secondaryButton.text}
              </Link>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src={heroData.mainImage.src}
                alt={heroData.mainImage.alt}
                className="w-full h-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blog-black/50 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{heroData.imageCaption.title}</h3>
                <p className="opacity-80">{heroData.imageCaption.subtitle}</p>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-blog-yellow p-6 rounded-full shadow-lg">
              <span className="text-blog-black font-black text-xl">{heroData.badge.text}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-in" style={{ animationDelay: '0.7s' }}>
        <button 
          onClick={scrollToContent} 
          className="flex flex-col items-center text-blog-black hover:opacity-70 transition-opacity"
          aria-label="Scroll down"
          id="content"
        >
          <ArrowDown size={36} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;

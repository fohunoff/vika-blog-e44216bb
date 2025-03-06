
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';

interface AboutData {
  title: string;
  paragraphs: string[];
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
}

const AboutSection = () => {
  const { api } = useApi();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await api.home.getAboutData();
        setAboutData(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, [api.home]);

  if (isLoading || !aboutData) {
    return <section className="py-24 bg-blog-white"><div className="blog-container">Загрузка информации...</div></section>;
  }

  return (
    <section className="py-24 bg-blog-white">
      <div className="blog-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-fade-up">
            <h2 className="section-title mb-6" dangerouslySetInnerHTML={{ __html: aboutData.title }}></h2>
            {aboutData.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg mb-6">
                {paragraph}
              </p>
            ))}
            <Link 
              to={aboutData.buttonLink}
              className="inline-block bg-blog-yellow text-blog-black px-8 py-4 rounded-full hover:bg-blog-yellow-dark transition-colors"
            >
              {aboutData.buttonText}
            </Link>
          </div>
          <div className="order-1 md:order-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <img 
                src={aboutData.image}
                alt={aboutData.imageAlt}
                className="w-full h-auto rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-blog-yellow w-32 h-32 rounded-xl -z-10"></div>
              <div className="absolute -top-6 -left-6 bg-blog-black w-32 h-32 rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;


import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useApi } from '@/hooks/useApi';

interface NewsletterData {
  title: string;
  description: string;
  inputPlaceholder: string;
  successMessage: string;
}

const NewsletterSection = () => {
  const { api } = useApi();
  const [newsletterData, setNewsletterData] = useState<NewsletterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchNewsletterData = async () => {
      try {
        const data = await api.home.getNewsletterData();
        setNewsletterData(data);
      } catch (error) {
        console.error('Error fetching newsletter data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletterData();
  }, [api.home]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь должна быть логика для отправки формы
    console.log('Submitted email:', email);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail('');
  };

  if (isLoading || !newsletterData) {
    return <section className="py-24 bg-blog-yellow"><div className="blog-container">Загрузка формы подписки...</div></section>;
  }

  return (
    <section className="py-24 bg-blog-yellow">
      <div className="blog-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title mb-6">
            {newsletterData.title}
          </h2>
          <p className="text-lg mb-10">
            {newsletterData.description}
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={newsletterData.inputPlaceholder}
              required
              className="w-full px-6 py-4 rounded-full bg-blog-white text-blog-black focus:outline-none focus:ring-2 focus:ring-blog-black"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blog-black text-blog-white p-3 rounded-full hover:bg-opacity-90 transition-colors"
              aria-label="Subscribe"
            >
              <Send size={20} />
            </button>
          </form>
          
          {submitted && (
            <div className="mt-4 bg-blog-black text-blog-white px-4 py-2 rounded-full inline-block animate-fade-in">
              {newsletterData.successMessage}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

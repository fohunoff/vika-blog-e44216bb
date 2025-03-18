
'use client';

import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface NewsletterData {
  title: string;
  description: string;
  buttonText: string;
  placeholderText: string;
}

interface NewsletterSectionProps {
  data: NewsletterData | null;
}

const defaultNewsletter = {
  title: 'ПОДПИШИТЕСЬ НА РАССЫЛКУ',
  description: 'Получайте уведомления о новых записях и эксклюзивный контент прямо на вашу почту',
  buttonText: 'Подписаться',
  placeholderText: 'Ваш email'
};

const NewsletterSection = ({ data }: NewsletterSectionProps) => {
  const newsletter = data || defaultNewsletter;
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите корректный email",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // В будущем здесь будет реальный API запрос
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Спасибо за подписку!",
        description: "Вы успешно подписались на нашу рассылку",
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось оформить подписку. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-blog-yellow">
      <div className="blog-container text-center">
        <h2 className="section-title mb-6">
          {newsletter.title}
        </h2>
        <p className="text-xl mb-10 max-w-3xl mx-auto">
          {newsletter.description}
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={newsletter.placeholderText}
            className="flex-grow px-6 py-4 rounded-full bg-white border-2 border-transparent focus:border-blog-black focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-8 py-4 rounded-full bg-blog-black text-white hover:bg-blog-black/80 transition-colors disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? 'Подписка...' : newsletter.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;

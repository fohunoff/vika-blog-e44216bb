
import { useState } from 'react';
import { Send } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь должна быть логика для отправки формы
    console.log('Submitted email:', email);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail('');
  };

  return (
    <section className="py-24 bg-blog-yellow">
      <div className="blog-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title mb-6">
            БУДЬТЕ В КУРСЕ
          </h2>
          <p className="text-lg mb-10">
            Подпишитесь на мою рассылку, чтобы первыми узнавать о новых рецептах, местах и идеях.
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш email"
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
              Спасибо за подписку!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

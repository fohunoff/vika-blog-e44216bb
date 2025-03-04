
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const scrollToContent = () => {
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="h-screen relative overflow-hidden bg-blog-yellow flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2912')] bg-cover bg-center opacity-15"></div>
      
      <div className="blog-container relative z-10 text-center">
        <h1 className="text-6xl md:text-7xl lg:text-8xl uppercase font-black tracking-tighter mb-6 animate-fade-in">
          ЛИЧНЫЙ<br />БЛОГ
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Мой мир в оттенках желтого — рецепты, мысли, открытия и уютные истории.
        </p>
        <button 
          onClick={scrollToContent}
          className="animate-fade-in inline-flex items-center gap-2 bg-blog-black text-blog-white px-8 py-4 rounded-full hover:bg-opacity-90 transition-all"
          style={{ animationDelay: '0.4s' }}
        >
          Читать блог
          <ArrowDown size={18} />
        </button>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <button 
          onClick={scrollToContent} 
          className="flex flex-col items-center text-blog-black"
          aria-label="Scroll down"
        >
          <ArrowDown size={36} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;


import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-24 bg-blog-white">
      <div className="blog-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-fade-up">
            <h2 className="section-title mb-6">
              ОБО <span className="text-blog-yellow">МНЕ</span>
            </h2>
            <p className="text-lg mb-6">
              Привет! Меня зовут Анна, и я автор этого блога. Я люблю готовить, путешествовать по уютным кафе и создавать комфортное пространство вокруг себя.
            </p>
            <p className="text-lg mb-8">
              В своем блоге я делюсь рецептами, впечатлениями о кафе, мыслями о повседневности и идеями для дома. Здесь каждый может найти что-то интересное для себя.
            </p>
            <Link 
              to="/about" 
              className="inline-block bg-blog-yellow text-blog-black px-8 py-4 rounded-full hover:bg-blog-yellow-dark transition-colors"
            >
              Узнать больше
            </Link>
          </div>
          <div className="order-1 md:order-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=2574" 
                alt="Author" 
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

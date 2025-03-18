
import Link from 'next/link';
import Image from 'next/image';

interface AboutData {
  title: string;
  paragraphs: string[];
  buttonText: string;
  buttonLink: string;
  image: string;
  imageAlt: string;
}

interface AboutSectionProps {
  data: AboutData | null;
}

const defaultAbout = {
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

const AboutSection = ({ data }: AboutSectionProps) => {
  const about = data || defaultAbout;

  return (
    <section className="py-24 bg-blog-white">
      <div className="blog-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-fade-up">
            <h2 className="section-title mb-6" dangerouslySetInnerHTML={{ __html: about.title }}></h2>
            {about.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg mb-6">
                {paragraph}
              </p>
            ))}
            <Link
              href={about.buttonLink}
              className="inline-block bg-blog-yellow text-blog-black px-8 py-4 rounded-full hover:bg-blog-yellow-dark transition-colors"
            >
              {about.buttonText}
            </Link>
          </div>
          <div className="order-1 md:order-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={about.image}
                  alt={about.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>
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

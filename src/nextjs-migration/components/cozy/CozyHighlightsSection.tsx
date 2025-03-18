
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Cozy } from '@/types/cozy';

interface CozyHighlightCardProps {
  article: Cozy;
}

const CozyHighlightCard = ({ article }: CozyHighlightCardProps) => {
  const { id, title, content, image, type } = article;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm group">
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-2/5 relative">
          <div className="relative w-full h-64 md:h-full">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        <div className="md:w-3/5 p-6 flex flex-col justify-between">
          <div>
            <div className="mb-3">
              <span className="text-sm font-medium text-blog-yellow">{type}</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-gray-600">{content}</p>
          </div>

          <Link 
            href={`/cozy/article/${id}`}
            className="inline-flex items-center mt-4 font-medium text-blog-yellow hover:underline"
          >
            Читать полностью
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

interface CozyHighlightsSectionProps {
  highlights: Cozy[];
}

const CozyHighlightsSection = ({ highlights }: CozyHighlightsSectionProps) => {
  // Если записи не предоставлены, показываем заглушки
  const displayHighlights = highlights.length > 0 ? highlights.slice(0, 4) : [
    {
      id: 'highlight-1',
      title: 'Создаем уютную атмосферу в гостиной',
      content: 'Советы и рекомендации для создания комфортного пространства в вашей гостиной.',
      image: '/placeholder.svg',
      type: 'Интерьер',
      category: 'Гостиная',
      tags: ['Уют', 'Интерьер', 'Декор'],
      date: new Date().toISOString()
    },
    {
      id: 'highlight-2',
      title: 'Ароматы для дома: как создать приятную атмосферу',
      content: 'Выбор ароматов для разных комнат и способы их использования для создания особой атмосферы.',
      image: '/placeholder.svg',
      type: 'Атмосфера',
      category: 'Ароматы',
      tags: ['Ароматы', 'Дом', 'Уют'],
      date: new Date().toISOString()
    }
  ];

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Рекомендуем</h2>
        <Link href="/cozy/highlights" className="text-blog-yellow hover:underline inline-flex items-center">
          Все материалы
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {displayHighlights.map((highlight) => (
          <CozyHighlightCard
            key={highlight.id}
            article={highlight}
          />
        ))}
      </div>
    </section>
  );
};

export default CozyHighlightsSection;


import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface CozyTagsSectionProps {
  tags: string[];
}

const CozyTagsSection = ({ tags }: CozyTagsSectionProps) => {
  // Если теги не предоставлены, показываем заглушки
  const displayTags = tags.length > 0 ? tags : [
    'Уют', 'Интерьер', 'Декор', 'Растения', 'Освещение', 'Текстиль',
    'Минимализм', 'Скандинавский стиль', 'Лофт', 'Прованс', 'Хранение', 
    'Цвет', 'Планировка', 'Ремонт', 'Мебель', 'Аксессуары'
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold mb-6">Популярные темы</h3>
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag, index) => (
          <Link href={`/cozy/tag/${encodeURIComponent(tag)}`} key={index}>
            <Badge
              className="bg-blog-gray text-gray-700 hover:bg-blog-yellow hover:text-blog-black cursor-pointer px-3 py-1.5"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CozyTagsSection;

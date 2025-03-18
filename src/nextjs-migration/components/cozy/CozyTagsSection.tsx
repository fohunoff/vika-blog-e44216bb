
import Link from 'next/link';
import { CozyTag } from '@/types/cozy';

interface CozyTagsSectionProps {
  tags: CozyTag[];
}

const CozyTagsSection = ({ tags }: CozyTagsSectionProps) => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Популярные теги</h2>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link 
            key={tag.id} 
            href={`/cozy/tag/${tag.id}`}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CozyTagsSection;


import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface DiaryTagsProps {
  tags: string[];
}

const DiaryTags = ({ tags }: DiaryTagsProps) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <section className="py-10 bg-white">
      <div className="blog-container">
        <h3 className="text-lg font-semibold mb-4">Теги</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Link href={`/diary?tag=${encodeURIComponent(tag)}`} key={index}>
              <Badge 
                variant="secondary"
                className="bg-blog-yellow-light text-blog-black hover:bg-blog-yellow cursor-pointer"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiaryTags;

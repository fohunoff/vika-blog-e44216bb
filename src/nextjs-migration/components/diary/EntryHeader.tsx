
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface EntryHeaderProps {
  entryImage?: string;
  title: string;
}

const EntryHeader = ({ entryImage, title }: EntryHeaderProps) => {
  return (
    <>
      <Link 
        href="/diary"
        className="inline-flex items-center text-gray-500 hover:text-blog-yellow mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4"/> Назад к дневнику
      </Link>

      {entryImage && (
        <div className="relative h-[300px] md:h-[500px] w-full mb-8 rounded-xl overflow-hidden">
          {/* If using Next.js Image optimization */}
          <img
            src={entryImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  );
};

export default EntryHeader;

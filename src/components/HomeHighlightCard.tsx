
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HomeHighlightCardProps {
  id: number;
  title: string;
  content: string;
  image: string;
  type: string;
}

const HomeHighlightCard = ({ id, title, content, image, type }: HomeHighlightCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm group">
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-2/5 relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ minHeight: "240px" }}
          />
        </div>
        
        <div className="md:w-3/5 p-6 flex flex-col justify-between">
          <div>
            <div className="mb-3">
              <span className="text-sm font-medium text-blog-yellow">{type}</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-gray-600">{content}</p>
          </div>
          
          <Link to={`/home/highlight/${id}`} className="inline-flex items-center mt-4 font-medium text-blog-yellow hover:underline">
            Читать полностью
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeHighlightCard;

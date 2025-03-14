
import { Calendar, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { DiaryEntry } from "@/types/models";

interface DiaryEntryCardProps {
  entry: DiaryEntry & {
    category?: string;
    tags?: string[];
    mood?: string;
  };
  index: number;
}

const DiaryEntryCard = ({ entry, index }: DiaryEntryCardProps) => {
  // Format date to Russian locale
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy", { locale: ru });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <article
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="md:flex">
        {entry.imageSrc && (
          <div className="md:w-1/3 h-60 md:h-auto overflow-hidden">
            <img
              src={entry.imageSrc}
              alt={entry.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}

        <div className={`p-8 ${entry.imageSrc ? "md:w-2/3" : "w-full"}`}>
          <div className="flex items-center text-gray-500 text-sm mb-4 gap-4">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formatDate(entry.date)}</span>
            </div>
            {entry.mood && (
              <div className="flex items-center gap-1">
                <MessageSquare size={16} />
                <span>{entry.mood}</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4">{entry.title}</h2>
          <p className="text-gray-700 mb-6 line-clamp-3">
            {entry.shortDescription || entry.content.substring(0, 150) + "..."}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {entry.tags &&
              entry.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-blog-yellow-light text-blog-black"
                >
                  {tag}
                </Badge>
              ))}
          </div>

          <Link to={`/diary/${entry.id}`}>
            <Button
              variant="outline"
              className="border-blog-yellow text-blog-black hover:bg-blog-yellow hover:text-blog-black"
            >
              Читать полностью
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default DiaryEntryCard;

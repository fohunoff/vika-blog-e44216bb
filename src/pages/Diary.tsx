
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, FileText, MessageSquare, Tag } from 'lucide-react';
import BlogHeader from '../components/BlogHeader';
import Footer from '../components/Footer';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEnrichedDiaryEntries, useApi } from '../hooks/useApi';
import { DiaryEntry } from '@/types/models';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Diary = () => {
  const { data: enrichedEntries, isLoading } = useEnrichedDiaryEntries();
  const { api } = useApi();
  const [allMoods, setAllMoods] = useState<{id: string, name: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch moods
    api.diary.getMoods().then(moods => {
      setAllMoods(moods);
    });
  }, [api.diary]);

  // Filter entries based on search query and selected mood
  const filteredEntries = enrichedEntries
    ? enrichedEntries.filter(entry => {
        const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            entry.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesMood = !selectedMood || entry.mood === selectedMood;
        return matchesSearch && matchesMood;
      })
    : [];

  // Function to handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(selectedMood === mood ? null : mood);
  };

  // Collect all tags from diary entries
  const allTags = enrichedEntries
    ? Array.from(new Set(enrichedEntries.flatMap(entry => entry.tags || []))).filter(Boolean) as string[]
    : [];

  // Format date to Russian locale
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: ru });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <main className="min-h-screen pt-24">
      <BlogHeader />
      
      {/* Заголовок и поиск */}
      <div className="blog-container py-12">
        <h1 className="section-title mb-8 text-center">
          ЛИЧНЫЙ ДНЕВНИК
        </h1>
        <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
          Здесь я делюсь своими мыслями, впечатлениями и моментами из повседневной жизни. Маленькие радости, открытия и размышления.
        </p>
        
        <div className="relative max-w-md mx-auto mb-16">
          <Input
            type="text"
            placeholder="Поиск по записям..."
            className="pl-10 pr-4 py-3 rounded-full border-2 border-blog-yellow bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      
      {/* Фильтр по настроению */}
      <div className="bg-blog-black py-8">
        <div className="blog-container">
          <div className="flex items-center gap-2 mb-4 text-blog-white">
            <MessageSquare size={20} />
            <h2 className="text-xl font-bold">Настроение</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {allMoods.map((mood) => (
              <Button
                key={mood.id}
                variant={selectedMood === mood.name ? "default" : "outline"}
                className={`rounded-full ${
                  selectedMood === mood.name 
                    ? "bg-blog-yellow text-blog-black hover:bg-blog-yellow-dark" 
                    : "bg-transparent text-blog-white border-blog-white hover:bg-blog-white/10"
                }`}
                onClick={() => handleMoodSelect(mood.name)}
              >
                {mood.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Записи дневника */}
      <div className="blog-container py-16">
        {isLoading ? (
          <div className="text-center py-12">
            <p>Загрузка записей...</p>
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="space-y-16">
            {filteredEntries.map((entry, index) => (
              <article 
                key={entry.id}
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
                  
                  <div className={`p-8 ${entry.imageSrc ? 'md:w-2/3' : 'w-full'}`}>
                    <div className="flex items-center text-gray-500 text-sm mb-4 gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{formatDate(entry.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={16} />
                        <span>{entry.mood}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">{entry.title}</h2>
                    <p className="text-gray-700 mb-6 line-clamp-3">{entry.shortDescription || entry.content.substring(0, 150) + '...'}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {entry.tags && entry.tags.map(tag => (
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">Записи не найдены</h3>
            <p className="text-gray-600">
              Попробуйте изменить параметры поиска или выбрать другое настроение.
            </p>
          </div>
        )}
      </div>
      
      {/* Популярные теги */}
      <div className="bg-blog-yellow-light py-12">
        <div className="blog-container">
          <div className="flex items-center gap-2 mb-6">
            <Tag size={20} />
            <h2 className="text-xl font-bold">Популярные теги</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 12).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="bg-white hover:bg-gray-100 text-blog-black cursor-pointer"
                onClick={() => setSearchQuery(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Diary;

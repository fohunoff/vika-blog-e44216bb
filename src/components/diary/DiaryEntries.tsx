
import { BookOpen } from "lucide-react";
import DiaryEntryCard from "./DiaryEntryCard";
import { DiaryEntry } from "@/types/models";

interface DiaryEntriesProps {
  entries: (DiaryEntry & {
    category?: string;
    tags?: string[];
    mood?: string;
  })[];
  isLoading: boolean;
}

const DiaryEntries = ({ entries, isLoading }: DiaryEntriesProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Загрузка записей...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={64} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-2xl font-bold mb-2">Записи не найдены</h3>
        <p className="text-gray-600">
          Попробуйте изменить параметры поиска или выбрать другое настроение.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {entries.map((entry, index) => (
        <DiaryEntryCard key={entry.id} entry={entry} index={index} />
      ))}
    </div>
  );
};

export default DiaryEntries;

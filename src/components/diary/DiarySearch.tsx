
import { FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DiarySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DiarySearch = ({ searchQuery, setSearchQuery }: DiarySearchProps) => {
  return (
    <div className="relative max-w-md mx-auto mb-16">
      <Input
        type="text"
        placeholder="Поиск по записям..."
        className="pl-10 pr-4 py-3 rounded-full border-2 border-blog-yellow bg-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <FileText
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
    </div>
  );
};

export default DiarySearch;

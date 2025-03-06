
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface CafeSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CafeSearch = ({ searchQuery, setSearchQuery }: CafeSearchProps) => {
  return (
    <div className="blog-container py-12">
      <h1 className="section-title mb-8 text-center">
        ОБЗОРЫ КАФЕ
      </h1>
      <p className="text-center text-xl mb-12 max-w-3xl mx-auto">
        Здесь вы найдете мои впечатления о различных кафе и ресторанах, атмосфере и кухне. Делюсь любимыми местами и новыми открытиями.
      </p>
      
      <div className="relative max-w-md mx-auto mb-16">
        <Input
          type="text"
          placeholder="Найти кафе или ресторан..."
          className="pl-10 pr-4 py-3 rounded-full border-2 border-blog-yellow bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
    </div>
  );
};

export default CafeSearch;


import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RecipeSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const RecipeSearch = ({ searchQuery, setSearchQuery }: RecipeSearchProps) => {
  return (
    <div className="relative max-w-md mx-auto mb-16">
      <Input
        type="text"
        placeholder="Найти рецепт..."
        className="pl-10 pr-4 py-3 rounded-full border-2 border-blog-yellow bg-white"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  );
};

export default RecipeSearch;


import { Tag, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CafeFiltersProps {
  categories: string[];
  priceRanges: string[];
  selectedCategory: string | null;
  selectedPriceRange: string | null;
  setSelectedCategory: (category: string | null) => void;
  setSelectedPriceRange: (price: string | null) => void;
}

const CafeFilters = ({
  categories,
  priceRanges,
  selectedCategory,
  selectedPriceRange,
  setSelectedCategory,
  setSelectedPriceRange
}: CafeFiltersProps) => {
  return (
    <div className="bg-blog-black py-8">
      <div className="blog-container">
        <div className="flex flex-wrap items-center gap-6 justify-between">
          {/* Категории */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-blog-white">
              <Tag size={20} />
              <h2 className="text-xl font-bold">Категория:</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`rounded-full ${
                    selectedCategory === category 
                      ? "bg-blog-yellow text-blog-black hover:bg-blog-yellow-dark" 
                      : "bg-transparent text-blog-white border-blog-white hover:bg-blog-white/10"
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Ценовая категория */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-blog-white">
              <Filter size={20} />
              <h2 className="text-xl font-bold">Цена:</h2>
            </div>
            
            <div className="flex gap-2">
              {priceRanges.map((price) => (
                <Button
                  key={price}
                  variant={selectedPriceRange === price ? "default" : "outline"}
                  className={`rounded-full ${
                    selectedPriceRange === price 
                      ? "bg-blog-yellow text-blog-black hover:bg-blog-yellow-dark" 
                      : "bg-transparent text-blog-white border-blog-white hover:bg-blog-white/10"
                  }`}
                  onClick={() => setSelectedPriceRange(selectedPriceRange === price ? null : price)}
                >
                  {price}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeFilters;

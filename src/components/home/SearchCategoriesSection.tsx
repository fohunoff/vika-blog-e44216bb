
import { Search, Armchair, Lamp, Sprout, Coffee, Bath, Smartphone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchCategoriesSection = () => {
  const categories = [
    { icon: <Armchair size={16} />, label: "Мебель" },
    { icon: <Lamp size={16} />, label: "Освещение" },
    { icon: <Sprout size={16} />, label: "Растения" },
    { icon: <Coffee size={16} />, label: "Кухня" },
    { icon: <Bath size={16} />, label: "Ванная" },
    { icon: <Smartphone size={16} />, label: "Умный дом" },
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm mb-16">
      <div className="relative mb-8">
        <Input 
          type="text" 
          placeholder="Поиск идей для дома..." 
          className="pl-10 pr-4 py-3 w-full"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
      </div>
      
      <div className="flex flex-wrap gap-3">
        {categories.map((category, index) => (
          <Button 
            key={index} 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-blog-yellow-light hover:text-blog-black transition-colors"
          >
            {category.icon}
            <span>{category.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchCategoriesSection;

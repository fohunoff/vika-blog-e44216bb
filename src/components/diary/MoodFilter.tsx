
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MoodFilterProps {
  allMoods: { id: string; name: string }[];
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

const MoodFilter = ({ allMoods, selectedMood, onMoodSelect }: MoodFilterProps) => {
  return (
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
              onClick={() => onMoodSelect(mood.name)}
            >
              {mood.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodFilter;

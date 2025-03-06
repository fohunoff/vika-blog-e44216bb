
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const PaginationNav = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ""
}: PaginationNavProps) => {
  // Создаем массив страниц для отображения
  const getPageNumbers = () => {
    // Если страниц меньше 7, просто покажем все
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Показываем первую, последнюю и 5 страниц вокруг текущей
    const pages = [];
    
    // Всегда показываем первую страницу
    pages.push(1);
    
    // Определяем диапазон страниц вокруг текущей
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // Если мы близко к началу, сдвигаем диапазон вправо
    if (startPage <= 2) {
      endPage = Math.min(totalPages - 1, 6);
    }
    
    // Если мы близко к концу, сдвигаем диапазон влево
    if (endPage >= totalPages - 1) {
      startPage = Math.max(2, totalPages - 5);
    }
    
    // Добавляем многоточие после первой страницы, если нужно
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Добавляем страницы из диапазона
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Добавляем многоточие перед последней страницей, если нужно
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Всегда показываем последнюю страницу
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} aria-label="Навигация по страницам">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`Страница ${page}`}
              className={page === currentPage ? "pointer-events-none" : ""}
            >
              {page}
            </Button>
          ) : (
            <div key={index} className="flex items-center px-3">
              <span className="text-gray-500">...</span>
            </div>
          )
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Следующая страница"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

export default PaginationNav;

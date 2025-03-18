
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

interface EntryNotFoundProps {
  error?: Error | null;
}

const EntryNotFound = ({ error }: EntryNotFoundProps) => {
  const errorMessage = error?.message || "Запись не найдена";
  
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Запись не найдена</h2>
      <p className="text-gray-600 mb-6 max-w-md">
        {errorMessage}. Возможно, запись была удалена или вы перешли по неверной ссылке.
      </p>
      <Link to="/diary">
        <Button>Вернуться к списку записей</Button>
      </Link>
    </div>
  );
};

export default EntryNotFound;

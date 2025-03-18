
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ErrorDisplayProps {
  title: string;
  message: string;
}

const ErrorDisplay = ({ title, message }: ErrorDisplayProps) => {
  return (
    <div className="blog-container py-16 text-center">
      <h1 className="section-title mb-4">{title}</h1>
      <p className="mb-8">{message}</p>
      <Link href="/diary">
        <div className="bg-blog-yellow text-blog-black hover:bg-blog-yellow/80 py-2 px-4 rounded flex items-center justify-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться к дневнику
        </div>
      </Link>
    </div>
  );
};

export default ErrorDisplay;

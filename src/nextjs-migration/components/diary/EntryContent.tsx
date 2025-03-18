
'use client';

import DOMPurify from 'dompurify';
import { useEffect, useRef } from 'react';
import '../../styles/quill-viewer.css';

interface EntryContentProps {
  content: string;
}

const EntryContent = ({ content }: EntryContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && typeof window !== 'undefined') {
      // Санитизация HTML для предотвращения XSS-атак
      const sanitizedContent = DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['target'], // Разрешаем атрибут target для ссылок
      });
      
      contentRef.current.innerHTML = sanitizedContent;
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className="diary-content ql-editor"
    />
  );
};

export default EntryContent;


'use client';

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';
import '../../styles/quill-viewer.css';

interface EntryContentProps {
  content: string;
}

const ClientEntryContent = ({ content }: EntryContentProps) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Sanitize HTML to prevent XSS attacks
      const purified = DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['target'], // Allow target attribute for links
      });
      setSanitizedContent(purified);
    }
  }, [content]);

  return (
    <div 
      className="diary-content ql-editor"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default ClientEntryContent;


"use client";

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface EntryContentProps {
  content: string;
}

const ClientEntryContent = ({ content }: EntryContentProps) => {
  const [sanitizedContent, setSanitizedContent] = useState<string>('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Sanitize the HTML only in the browser
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


import React from 'react';
import DOMPurify from 'dompurify';

interface EntryContentProps {
  content: string;
}

const EntryContent: React.FC<EntryContentProps> = ({ content }) => {
  // Sanitize the HTML to prevent XSS attacks while preserving formatting
  const sanitizedContent = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target'], // Allow target attribute for links
  });

  return (
    <div 
      className="diary-content ql-editor"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default EntryContent;

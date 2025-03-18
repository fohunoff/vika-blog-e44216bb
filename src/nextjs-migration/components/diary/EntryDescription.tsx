
import React from 'react';

interface EntryDescriptionProps {
  description: string;
}

const EntryDescription = ({ description }: EntryDescriptionProps) => {
  return (
    <p className="text-xl text-gray-700 mb-8 font-serif italic">
      {description}
    </p>
  );
};

export default EntryDescription;

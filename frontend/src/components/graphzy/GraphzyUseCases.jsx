import React from 'react';
import { Card } from '../ui/Card';
import { Tag } from '../ui/Tag';

export default function GraphzyUseCases({ onSelectQuery }) {
  const templates = [
    {
      subjectId: "math",
      query: "How does factor 'a' stretch a parabola y = ax²?",
    },
    {
      subjectId: "physics",
      query: "Simulate a projectile launch with customizable launch angle and velocity",
    },
    {
      subjectId: "chemistry",
      query: "Show a 2D water molecule H2O structure with bond angle and length parameters",
    },
    {
      subjectId: "biology",
      query: "Visualize the DNA double helix structure and nucleotide base pairing",
    }
  ];

  const getSubjectLabel = (subId) => {
    switch (subId) {
      case 'math': return 'Mathematics';
      case 'physics': return 'Physics';
      case 'chemistry': return 'Chemistry';
      case 'biology': return 'Biology';
      default: return 'Mathematics';
    }
  };

  const getSubjectTagVariant = (subId) => {
    switch (subId) {
      case 'math': return 'math';
      case 'physics': return 'phys';
      case 'chemistry': return 'chem';
      case 'biology': return 'bio';
      default: return 'math';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full max-w-4xl mx-auto">
      {templates.map((item, idx) => (
        <Card 
          key={idx}
          variant="surface"
          onClick={() => onSelectQuery(item.query)}
          className="p-5 text-left cursor-pointer hover:border-[#0066CC] hover:-translate-y-0.5 hover:shadow-md duration-200 flex flex-col justify-between min-h-[140px]"
        >
          <div>
            <div className="mb-3">
              <Tag variant={getSubjectTagVariant(item.subjectId)}>
                {getSubjectLabel(item.subjectId)}
              </Tag>
            </div>
            <div className="text-xs text-[#0F0F0F] font-semibold leading-normal">"{item.query}"</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

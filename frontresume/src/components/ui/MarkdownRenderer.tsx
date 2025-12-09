import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-gray-800">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mb-3 text-gray-800">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 text-gray-700">{children}</h3>,
          p: ({ children }) => <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-gray-700">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
          code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-gray-800">{children}</code>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

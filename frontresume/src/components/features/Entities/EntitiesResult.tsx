'use client';

import { Card } from '@/components/ui/Card';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';
import { Button } from '@/components/ui/Button';

interface EntitiesResultProps {
  result: string;
  onReset: () => void;
}

export const EntitiesResult: React.FC<EntitiesResultProps> = ({ result, onReset }) => {
  const handleDownloadMarkdown = () => {
    const blob = new Blob([result], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entities-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            🏷️ Entidades Nombradas Extraídas
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleDownloadMarkdown}>
              💾 Descargar MD
            </Button>
          </div>
        </div>
        
        <div className="prose max-w-none">
          <MarkdownRenderer content={result} />
        </div>
      </Card>

      <div className="flex justify-center">
        <Button variant="secondary" onClick={onReset}>
          ← Analizar otro texto
        </Button>
      </div>
    </div>
  );
};

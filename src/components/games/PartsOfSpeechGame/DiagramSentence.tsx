import { ArrowRight } from 'lucide-react';

interface DiagramSentenceProps {
  text: string;
  colorClass?: string;
}

export function DiagramSentence({ text, colorClass }: DiagramSentenceProps) {
  // Extract base color from colorClass, e.g. 'bg-blue-50 border-blue-300' -> 'blue'
  const extractColor = (cls?: string) => {
    if (!cls) return 'primary';
    const match = cls.match(/bg-(red|blue|green|yellow|indigo|purple|pink|gray|sky)-/);
    return match ? match[1] : 'primary';
  };
  
  const baseColor = extractColor(colorClass);
  // Default text color for the tags based on the theme
  const getTagStyle = () => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      sky: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    };
    return colorMap[baseColor] || 'bg-primary/10 text-primary border-primary/20';
  };

  const tagStyle = getTagStyle();
  const examples = text.split(' / ').map(s => s.trim());

  return (
    <div className="space-y-4">
      {examples.map((ex, i) => (
        <div key={i} className="flex flex-wrap items-center gap-x-1.5 gap-y-3 text-lg font-medium text-text">
          {ex.split(/(\([^)]+\))/).map((part, j) => {
            if (!part) return null;
            if (part.startsWith('(') && part.endsWith(')')) {
              return (
                <span 
                  key={j} 
                  className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm mx-1 ${tagStyle} transform -translate-y-0.5`}
                >
                  {part.slice(1, -1)}
                </span>
              );
            } else if (part.includes('→')) {
              const subparts = part.split('→');
              return subparts.map((sp, k) => (
                <span key={`${j}-${k}`} className="flex items-center">
                  {k > 0 && <ArrowRight size={18} className={`mx-2 ${tagStyle.split(' ')[1]}`} />}
                  <span>{sp}</span>
                </span>
              ));
            }
            return <span key={j}>{part.trim()}</span>;
          })}
        </div>
      ))}
    </div>
  );
}

interface DiagramSentenceProps {
  text: string;
  colorClass?: string;
}

/** Keep the sentence readable; explain its annotations underneath it. */
export function DiagramSentence({ text }: DiagramSentenceProps) {
  return <div className="space-y-4">
    {text.split(' / ').map((example, index) => {
      const sentence = example.replace(/\s*\([^)]+\)/g, '').replace(/\s+([.,!?;:])/g, '$1').trim();
      const annotations = Array.from(example.matchAll(/([^()]+)\(([^)]+)\)/g)).map(match => ({
        phrase: /^(person|place|thing|idea|noun|verb|pronoun|article|adj|adjective|adv|adverb)$/i.test(match[2])
          ? (match[1].trim().match(/[\w’-]+[.!?]?$/)?.[0] ?? match[1].trim())
          : match[1].trim().replace(/^[.,;:]\s*/, ''),
        label: match[2],
      }));
      return <div key={index} className="space-y-2">
        <p className="text-lg leading-relaxed text-text">{sentence}</p>
        {annotations.length > 0 && <ul className="space-y-1 text-sm leading-relaxed text-text-muted">
          {annotations.map((annotation, i) => <li key={i}><span className="font-semibold text-text">{annotation.phrase}</span>: {annotation.label}</li>)}
        </ul>}
      </div>;
    })}
  </div>;
}

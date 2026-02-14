import React from 'react';

interface MarkdownTextProps {
    content: string;
    isUser?: boolean;
}

const MarkdownText: React.FC<MarkdownTextProps> = ({ content, isUser = false }) => {
    // For user messages, preserve whitespace but keep styling simple
    if (isUser) {
        return <div className="whitespace-pre-wrap font-sans">{content}</div>;
    }

    if (!content) return null;

    // Advanced parsing for Bot (Split by code blocks first)
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="text-sm space-y-2 font-sans w-full overflow-hidden">
            {parts.map((part, i) => {
                // Code Blocks
                if (part.startsWith('```')) {
                    const codeContent = part.replace(/```.*\n?/, '').replace(/```$/, '');
                    // Basic language detection from first line
                    const langMatch = part.match(/```(\w+)/);
                    const lang = langMatch ? langMatch[1] : 'Code';
                    
                    return (
                        <div key={i} className="relative group my-3 rounded-lg overflow-hidden border border-white/10 bg-[#0d1117]">
                             <div className="flex justify-between items-center px-3 py-1 bg-white/5 border-b border-white/5">
                                <span className="text-[10px] text-gray-400 font-mono uppercase">{lang}</span>
                             </div>
                             <pre className="p-3 overflow-x-auto custom-scrollbar">
                                <code className="text-xs font-mono text-blue-200 font-normal whitespace-pre">{codeContent}</code>
                             </pre>
                        </div>
                    );
                }
                
                // Regular Markdown Text
                return <div key={i}>{parseLines(part)}</div>;
            })}
        </div>
    );
};

const parseLines = (text: string) => {
    return text.split('\n').map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;

        // Headers
        if (line.startsWith('### ')) return <h4 key={index} className="text-sm font-bold text-royalGold mt-4 mb-2">{parseInline(line.slice(4))}</h4>;
        if (line.startsWith('## ')) return <h3 key={index} className="text-base font-bold text-white mt-5 mb-2 border-b border-white/10 pb-1">{parseInline(line.slice(3))}</h3>;
        if (line.startsWith('# ')) return <h2 key={index} className="text-lg font-bold text-royalGold mt-6 mb-3 border-b border-royalGold/20 pb-2">{parseInline(line.slice(2))}</h2>;

        // Blockquotes
        if (line.startsWith('> ')) return <blockquote key={index} className="border-l-2 border-royalGold pl-4 my-2 italic text-gray-400 bg-white/5 py-1 pr-2 rounded-r">{parseInline(line.slice(2))}</blockquote>;

        // Unordered Lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
                <div key={index} className="flex gap-2 ml-1 my-1">
                    <span className="text-royalGold min-w-[12px] text-lg leading-[1rem]">•</span>
                    <span className="text-gray-300 leading-relaxed">{parseInline(trimmed.slice(2))}</span>
                </div>
            );
        }
        
        // Ordered Lists
        const orderedMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (orderedMatch) {
             return (
                <div key={index} className="flex gap-2 ml-1 my-1">
                    <span className="text-royalGold font-mono text-xs pt-[3px] min-w-[16px]">{orderedMatch[1]}.</span>
                    <span className="text-gray-300 leading-relaxed">{parseInline(orderedMatch[2])}</span>
                </div>
            );
        }

        // Table Rows (Basic)
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
             const cells = trimmed.split('|').filter(c => c.trim() !== '');
             const isHeader = trimmed.includes('---');
             if (isHeader) return null; // Skip separator lines for simplicity in this basic parser
             
             return (
                 <div key={index} className="grid grid-flow-col auto-cols-fr gap-2 border-b border-white/5 py-2 last:border-0">
                     {cells.map((c, ci) => <div key={ci} className="text-xs text-gray-300 px-1">{parseInline(c.trim())}</div>)}
                 </div>
             )
        }

        // Standard Paragraph
        return <p key={index} className="text-gray-300 leading-relaxed mb-2">{parseInline(line)}</p>;
    });
};

const parseInline = (text: string) => {
    // Helper to handle bold (**text**) and italic (*text*)
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2 && !part.includes('**')) {
            return <em key={i} className="text-royalGold/90 not-italic">{part.slice(1, -1)}</em>;
        }
        return part;
    });
};

export default MarkdownText;
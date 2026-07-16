import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeViewer({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const lines = code ? code.trim().split('\n') : ['// No code provided'];

  return (
    <div className="relative border border-white/10 rounded-xl overflow-hidden bg-slate-950/70 font-mono text-sm max-w-full shadow-lg">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-slate-900/60 select-none">
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/5 hover:border-white/10"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Text Container */}
      <div className="p-4 overflow-x-auto select-text flex">
        {/* Line Numbers */}
        <div className="pr-4 border-r border-white/5 text-right text-slate-600 select-none flex-shrink-0 text-xs leading-6">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        {/* Code Content */}
        <pre className="pl-4 text-slate-200 leading-6 text-xs flex-grow whitespace-pre overflow-x-auto scrollbar-thin">
          <code className="code-font">{code || '// No code generated yet'}</code>
        </pre>
      </div>
    </div>
  );
}

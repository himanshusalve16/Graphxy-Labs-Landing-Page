import React, { useEffect, useRef, useState } from 'react';

export function MathRenderer({ text, inline = false, className = "" }) {
  const containerRef = useRef(null);
  const [katexLoaded, setKatexLoaded] = useState(!!window.katex);

  useEffect(() => {
    if (window.katex) {
      setKatexLoaded(true);
      return;
    }
    const interval = setInterval(() => {
      if (window.katex) {
        setKatexLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      if (window.katex) {
        try {
          window.katex.render(text, containerRef.current, {
            displayMode: !inline,
            throwOnError: false,
            trust: true
          });
        } catch (err) {
          console.error("KaTeX error:", err);
          containerRef.current.textContent = text;
        }
      } else {
        containerRef.current.textContent = text;
      }
    }
  }, [text, inline, katexLoaded]);

  return <span ref={containerRef} className={className} />;
}

export function LatexText({ children, className = "" }) {
  const [katexLoaded, setKatexLoaded] = useState(!!window.katex);

  useEffect(() => {
    if (window.katex) {
      setKatexLoaded(true);
      return;
    }
    const interval = setInterval(() => {
      if (window.katex) {
        setKatexLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (typeof children !== 'string') return <span>{children}</span>;

  // Split by $$ first (block math)
  const blockParts = children.split(/(\$\$.*?\$\$)/gs);

  return (
    <span className={className}>
      {blockParts.map((blockPart, bIdx) => {
        if (blockPart.startsWith('$$') && blockPart.endsWith('$$')) {
          const math = blockPart.slice(2, -2);
          return (
            <span key={bIdx} className="block my-3 text-center overflow-x-auto">
              <MathRenderer text={math} inline={false} />
            </span>
          );
        }

        // Now split by $ (inline math)
        const inlineParts = blockPart.split(/(\$.*?\$)/g);
        return (
          <React.Fragment key={bIdx}>
            {inlineParts.map((inlinePart, iIdx) => {
              if (inlinePart.startsWith('$') && inlinePart.endsWith('$')) {
                const math = inlinePart.slice(1, -1);
                return <MathRenderer key={iIdx} text={math} inline={true} />;
              }
              return <span key={iIdx} dangerouslySetInnerHTML={{ __html: inlinePart }} />;
            })}
          </React.Fragment>
        );
      })}
    </span>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '../ui/Card';

export default function GraphzyPreview({ equation, sliders, onSliderChange }) {
  const containerRef = useRef(null);
  const calcRef = useRef(null);
  const [sliderVals, setSliderVals] = useState({});

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if Desmos is loaded from CDN
    if (typeof window.Desmos === 'undefined') {
      console.warn("Desmos API CDN is not loaded. Canvas preview degraded.");
      return;
    }

    // Initialize calculator
    if (!calcRef.current) {
      calcRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
        keypad: false,
        expressions: false,
        settingsMenu: false,
        lockViewport: false
      });
    }

    // Reset layout
    calcRef.current.setBlank();

    // Set main graphing expression
    calcRef.current.setExpression({ id: 'graph1', latex: equation, color: window.Desmos.Colors.BLUE });

    // Set up initial sliders values in state and calculator
    const initialVals = {};
    sliders.forEach(sl => {
      initialVals[sl.id] = sl.val;
      calcRef.current.setExpression({ id: `var_${sl.id}`, latex: `${sl.id} = ${sl.val}` });
    });
    setSliderVals(initialVals);

    return () => {
      // Clean up if needed
    };
  }, [equation, sliders]);

  const handleSliderUpdate = (id, val, min, max, step) => {
    const numericVal = parseFloat(val);
    
    // Update local state
    setSliderVals(prev => ({
      ...prev,
      [id]: numericVal
    }));

    // Update Desmos parameter
    if (calcRef.current) {
      calcRef.current.setExpression({ id: `var_${id}`, latex: `${id} = ${numericVal}` });
    }

    if (onSliderChange) {
      onSliderChange(id, numericVal);
    }
  };

  return (
    <Card variant="surface" className="p-6 flex flex-col w-full">
      {/* Visual Canvas Container */}
      <div 
        ref={containerRef} 
        id="desmos-calculator"
        className="w-full h-[380px] bg-[#F8F8F6] border border-black/5 rounded-xl overflow-hidden relative"
      >
        {typeof window.Desmos === 'undefined' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-[#FAFAF8]">
            <span className="font-mono text-xs text-[#92400E] mb-2 uppercase tracking-widest font-semibold">degraded mode</span>
            <p className="text-xs text-[#525252] max-w-xs leading-relaxed">
              Interactive Desmos graph is offline. Connect to internet or verify CDN script integration.
            </p>
          </div>
        )}
      </div>

      {/* Sliders list */}
      <div className="mt-5 flex flex-col gap-4">
        {sliders.map(sl => {
          const currentVal = sliderVals[sl.id] !== undefined ? sliderVals[sl.id] : sl.val;
          const percentage = ((currentVal - sl.min) / (sl.max - sl.min)) * 100;
          
          return (
            <div key={sl.id} className="flex flex-col">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-semibold text-[#0F0F0F]">{sl.label}</span>
                <span className="font-mono text-xs font-semibold text-[#0066CC]">{currentVal.toFixed(1)}</span>
              </div>
              
              <div className="relative w-full h-4 flex items-center group cursor-pointer">
                {/* Visual track background */}
                <div className="absolute left-0 right-0 h-1 bg-black/[0.08] rounded-full" />
                {/* Visual active fill */}
                <div 
                  className="absolute left-0 h-1 bg-[#0066CC] rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
                {/* Slider Input */}
                <input 
                  type="range"
                  min={sl.min}
                  max={sl.max}
                  step={sl.step}
                  value={currentVal}
                  onChange={(e) => handleSliderUpdate(sl.id, e.target.value, sl.min, sl.max, sl.step)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {/* Custom Thumb */}
                <div 
                  className="absolute w-4 h-4 rounded-full bg-white border-2 border-[#0066CC] shadow-sm transform -translate-x-1/2 left-0 group-hover:scale-110 duration-150"
                  style={{ left: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

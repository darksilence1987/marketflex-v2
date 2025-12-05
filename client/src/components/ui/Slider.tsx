import { useState, useEffect, useCallback } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  minValue?: number;
  maxValue?: number;
  onChange: (values: { min: number; max: number }) => void;
  formatLabel?: (value: number) => string;
  className?: string;
}

export function DualRangeSlider({
  min,
  max,
  step = 1,
  minValue,
  maxValue,
  onChange,
  formatLabel = (v) => `$${v}`,
  className = '',
}: DualRangeSliderProps) {
  const [localMin, setLocalMin] = useState(minValue ?? min);
  const [localMax, setLocalMax] = useState(maxValue ?? max);
  const [isDragging, setIsDragging] = useState(false);

  // Update local state when props change
  useEffect(() => {
    if (!isDragging) {
      setLocalMin(minValue ?? min);
      setLocalMax(maxValue ?? max);
    }
  }, [minValue, maxValue, min, max, isDragging]);

  // Calculate percentage for styling
  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - step);
    setLocalMin(value);
  }, [localMax, step]);

  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + step);
    setLocalMax(value);
  }, [localMin, step]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    onChange({ min: localMin, max: localMax });
  }, [localMin, localMax, onChange]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Value Labels */}
      <div className="flex items-center justify-between">
        <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-sm font-medium text-emerald-400">{formatLabel(localMin)}</span>
        </div>
        <div className="text-slate-600 text-sm">to</div>
        <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-sm font-medium text-emerald-400">{formatLabel(localMax)}</span>
        </div>
      </div>

      {/* Slider Track */}
      <div className="relative h-2 bg-slate-800 rounded-full">
        {/* Active Range */}
        <div
          className="absolute h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={handleMinChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-full appearance-none bg-transparent cursor-pointer pointer-events-auto z-10 slider-thumb"
          style={{ 
            WebkitAppearance: 'none',
            pointerEvents: 'auto',
          }}
        />

        {/* Max Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={handleMaxChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-full appearance-none bg-transparent cursor-pointer pointer-events-auto z-20 slider-thumb"
          style={{ WebkitAppearance: 'none' }}
        />

        {/* Thumb indicators (visual) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-emerald-500 pointer-events-none z-30 transition-transform hover:scale-110"
          style={{ left: `calc(${minPercent}% - 10px)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-emerald-500 pointer-events-none z-30 transition-transform hover:scale-110"
          style={{ left: `calc(${maxPercent}% - 10px)` }}
        />
      </div>

      {/* Range Labels */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>

      {/* Custom Slider Styles */}
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          border: none;
          pointer-events: auto;
        }
        .slider-thumb::-webkit-slider-runnable-track {
          background: transparent;
        }
        .slider-thumb::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

// Simple single slider
interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
  className?: string;
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatLabel = (v) => String(v),
  className = '',
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{formatLabel(min)}</span>
        <span className="text-sm font-medium text-emerald-400">{formatLabel(value)}</span>
        <span className="text-sm text-slate-400">{formatLabel(max)}</span>
      </div>

      <div className="relative h-2 bg-slate-800 rounded-full">
        <div
          className="absolute h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full appearance-none bg-transparent cursor-pointer slider-thumb"
          style={{ WebkitAppearance: 'none' }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-emerald-500 pointer-events-none"
          style={{ left: `calc(${percent}% - 10px)` }}
        />
      </div>
    </div>
  );
}

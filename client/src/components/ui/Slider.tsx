import { useState, useEffect, useCallback, useRef } from 'react';

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
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Update local state when props change
  useEffect(() => {
    setLocalMin(minValue ?? min);
    setLocalMax(maxValue ?? max);
  }, [minValue, maxValue, min, max]);

  // Calculate percentage for styling
  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;

  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), localMax - step);
    setLocalMin(value);
    onChange({ min: value, max: localMax });
  }, [localMax, step, onChange]);

  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), localMin + step);
    setLocalMax(value);
    onChange({ min: localMin, max: value });
  }, [localMin, step, onChange]);

  // Determine which slider to prioritize based on click position
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const clickValue = min + (clickPercent / 100) * (max - min);
    
    // Determine which handle is closer
    const distToMin = Math.abs(clickValue - localMin);
    const distToMax = Math.abs(clickValue - localMax);
    
    if (distToMin < distToMax) {
      const newMin = Math.min(Math.round(clickValue / step) * step, localMax - step);
      setLocalMin(newMin);
      onChange({ min: newMin, max: localMax });
    } else {
      const newMax = Math.max(Math.round(clickValue / step) * step, localMin + step);
      setLocalMax(newMax);
      onChange({ min: localMin, max: newMax });
    }
  }, [min, max, step, localMin, localMax, onChange]);

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
      <div 
        ref={trackRef}
        className="relative h-6 cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Track Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-slate-800 rounded-full" />
        
        {/* Active Range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full pointer-events-none"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Slider Input */}
        <input
          ref={minInputRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={handleMinChange}
          className="absolute top-0 left-0 w-full h-full appearance-none bg-transparent cursor-pointer z-10"
          style={{ 
            WebkitAppearance: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Max Slider Input */}
        <input
          ref={maxInputRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute top-0 left-0 w-full h-full appearance-none bg-transparent cursor-pointer z-20"
          style={{ 
            WebkitAppearance: 'none',
            pointerEvents: 'none',
          }}
        />

        {/* Min Thumb (Visual & Interactive) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-emerald-500 cursor-grab active:cursor-grabbing z-30 hover:scale-110 transition-transform"
          style={{ left: `calc(${minPercent}% - 10px)` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startValue = localMin;
            
            const handleMouseMove = (moveEvent: MouseEvent) => {
              if (!trackRef.current) return;
              const rect = trackRef.current.getBoundingClientRect();
              const deltaPercent = ((moveEvent.clientX - startX) / rect.width) * 100;
              const deltaValue = (deltaPercent / 100) * (max - min);
              const newValue = Math.max(min, Math.min(startValue + deltaValue, localMax - step));
              const snappedValue = Math.round(newValue / step) * step;
              setLocalMin(snappedValue);
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
              onChange({ min: localMin, max: localMax });
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* Max Thumb (Visual & Interactive) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-emerald-500 cursor-grab active:cursor-grabbing z-30 hover:scale-110 transition-transform"
          style={{ left: `calc(${maxPercent}% - 10px)` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startValue = localMax;
            
            const handleMouseMove = (moveEvent: MouseEvent) => {
              if (!trackRef.current) return;
              const rect = trackRef.current.getBoundingClientRect();
              const deltaPercent = ((moveEvent.clientX - startX) / rect.width) * 100;
              const deltaValue = (deltaPercent / 100) * (max - min);
              const newValue = Math.max(localMin + step, Math.min(startValue + deltaValue, max));
              const snappedValue = Math.round(newValue / step) * step;
              setLocalMax(snappedValue);
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
              onChange({ min: localMin, max: localMax });
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
      </div>

      {/* Range Labels */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{formatLabel(min)}</span>
        <span>{formatLabel(max)}</span>
      </div>
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

      <div className="relative h-6">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-slate-800 rounded-full" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-full appearance-none bg-transparent cursor-pointer"
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

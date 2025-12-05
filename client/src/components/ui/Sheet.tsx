import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: 'left' | 'right';
  width?: string;
}

export function Sheet({
  isOpen,
  onClose,
  children,
  title,
  side = 'right',
  width = 'w-full max-w-md',
}: SheetProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Panel */}
      <div
        className={`absolute top-0 bottom-0 ${width} bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col
          ${side === 'right' ? 'right-0 animate-slide-in-right' : 'left-0 animate-slide-in-left'}`}
        style={{
          animation: `${side === 'right' ? 'slideInRight' : 'slideInLeft'} 0.3s ease-out`,
        }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

// SheetHeader Component
export function SheetHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 border-b border-slate-800">{children}</div>;
}

// SheetContent Component
export function SheetContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}

// SheetFooter Component
export function SheetFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-t border-slate-800 mt-auto">{children}</div>
  );
}

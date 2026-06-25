import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  X, 
  AlertOctagon,
  HelpCircle
} from 'lucide-react';
import { Button } from '../../src/components/ui/Button';

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = 'confirmation', // confirmation, delete, warning, info, success, error
  confirmText,
  cancelText = 'Cancel',
  confirmVariant, // override default button variant
  isLoading = false,
  children
}) {
  const modalRef = useRef(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <AlertTriangle className="w-5 h-5 text-red-650" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <AlertOctagon className="w-5 h-5 text-red-650" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-[#0D9488]" />;
      default:
        return <HelpCircle className="w-5 h-5 text-[#0D9488]" />;
    }
  };

  const getConfirmVariant = () => {
    if (confirmVariant) return confirmVariant;
    switch (type) {
      case 'delete':
      case 'error':
        return 'outline';
      case 'warning':
        return 'outline';
      default:
        return 'clampbox';
    }
  };

  const getConfirmStyle = () => {
    if (type === 'delete') {
      return 'bg-red-600 hover:bg-red-700 text-white shadow-[0_2px_8px_rgba(220,38,38,0.22)] focus-visible:ring-red-600';
    }
    return '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => {
              if (!isLoading) onClose();
            }}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="relative w-full max-w-md bg-white border border-black/[0.06] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden z-10 font-sans"
          >
            {/* Close Button */}
            {!isLoading && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]/30"
                aria-label="Close modal"
              >
                <X size={15} />
              </button>
            )}

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl flex-shrink-0 mt-0.5">
                  {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 id="modal-title" className="font-serif text-base font-semibold text-zinc-950 leading-tight">
                    {title}
                  </h3>
                  {description && (
                    <p className="mt-2 text-xs text-zinc-550 leading-relaxed font-sans">
                      {description}
                    </p>
                  )}
                  {children && <div className="mt-4">{children}</div>}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="px-6 py-4 bg-zinc-50/50 border-t border-black/[0.04] flex items-center justify-end gap-2.5">
              {!isLoading && cancelText && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="font-bold text-zinc-600 border-zinc-200 hover:bg-zinc-100/50"
                >
                  {cancelText}
                </Button>
              )}
              {onConfirm && (
                <Button
                  variant={getConfirmVariant()}
                  size="sm"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`font-bold ${getConfirmStyle()}`}
                >
                  {isLoading ? 'Processing...' : (confirmText || 'Confirm')}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

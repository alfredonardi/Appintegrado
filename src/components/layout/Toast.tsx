import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ToastProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { icon: CheckCircle2, bg: 'bg-green-600', border: 'border-green-700' },
    error: { icon: XCircle, bg: 'bg-red-600', border: 'border-red-700' },
    warning: { icon: AlertCircle, bg: 'bg-yellow-600', border: 'border-yellow-700' },
  };

  const Icon = config[type].icon;

  return (
    <div
      className={`fixed bottom-6 right-6 ${config[type].bg} text-white px-4 py-3 rounded-lg shadow-lg border ${config[type].border} flex items-center gap-3 min-w-[320px] max-w-md transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm flex-1">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

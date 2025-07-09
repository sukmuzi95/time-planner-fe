import { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  message: string | null;
  onClose: () => void;
}

export default function ErrorAlert({ message, onClose }: Props) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 5000); // 5초 후 자동 닫힘
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md flex items-center gap-2 w-max min-w-[300px]">
        <span className="font-semibold">⚠ 오류:</span>
        <span className="flex-1 text-sm">{message}</span>
        <button onClick={onClose}>
          <X className="w-4 h-4 text-red-700 hover:text-red-900" />
        </button>
      </div>
    </div>
  );
}

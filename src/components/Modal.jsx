import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl shadow-modal ring-1 ring-slate-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Emerald header bar */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0 bg-gradient-to-r from-primary-600 to-primary-500">
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto bg-slate-50/50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

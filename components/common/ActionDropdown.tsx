import React, { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';

export interface ActionDropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionDropdownProps {
  items: ActionDropdownItem[];
  align?: 'left' | 'right';
  size?: 'sm' | 'md';
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ items, align = 'right', size = 'sm' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const hasItems = items && items.length > 0;
  if (!hasItems) return null;

  const buttonClasses =
    size === 'sm'
      ? 'h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors'
      : 'h-9 px-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-1 text-xs font-medium transition-colors';

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        className={buttonClasses}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreVertical size={14} />
        {size === 'md' && <span>More</span>}
      </button>

      {open && (
        <div
          className={`absolute z-40 mt-1 min-w-[160px] rounded-lg border border-slate-200 bg-white shadow-lg shadow-slate-900/5 text-xs ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  setOpen(false);
                  item.onClick();
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
                  item.disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : item.tone === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;

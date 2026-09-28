import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { CategoryIcon } from '../utils/categoryIcons';
import { translateDynamicText } from '../utils/translateDynamicText';

/**
 * Custom category dropdown with visible icons (native <select> cannot render icons).
 */
export function CategorySelect({
  categories = [],
  value = '',
  onChange,
  placeholder = 'Select...',
  required = false,
  disabled = false,
  className = '',
  language = 'en',
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const getId = (c) => c?._id || c?.id;
  const selected = categories.find((c) => String(getId(c)) === String(value));
  const iconSize = compact ? 22 : 28;
  const iconClass = compact ? 'w-3 h-3' : 'w-3.5 h-3.5';

  useEffect(() => {
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const pick = (id) => {
    onChange?.(id);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${compact ? '' : 'mt-1'} ${className}`}>
      {required && (
        <input
          tabIndex={-1}
          required
          value={value}
          onChange={() => {}}
          className="sr-only absolute w-px h-px opacity-0"
          aria-hidden
        />
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center gap-2 rounded-xl border text-left outline-none transition
          ${compact ? 'px-2 py-1.5 text-xs gap-1.5' : 'px-3 py-2.5 text-sm gap-2.5'}
          ${open ? 'border-cc-lime ring-1 ring-cc-lime/30' : 'border-gray-200 focus:border-cc-lime'}
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white hover:border-cc-lime/60'}`}
      >
        {selected ? (
          <>
            <CategoryIcon
              iconKey={selected.icon}
              color={selected.color}
              className={iconClass}
              size={iconSize}
            />
            <span className="flex-1 truncate text-cc-forest font-medium">
              {translateDynamicText(selected.name, language)}
            </span>
          </>
        ) : (
          <span className="flex-1 text-cc-muted">{placeholder}</span>
        )}
        <ChevronDown className={`text-cc-muted shrink-0 transition ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          className={`absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg py-1 ${compact ? 'min-w-[180px]' : ''}`}
          role="listbox"
        >
          <li>
            <button
              type="button"
              onClick={() => pick('')}
              className={`w-full flex items-center px-3 text-cc-muted hover:bg-gray-50 text-left ${compact ? 'py-1.5 text-xs gap-1.5' : 'py-2 text-sm gap-2.5'}`}
            >
              {placeholder}
            </button>
          </li>
          {categories.map((c) => {
            const id = getId(c);
            const isActive = String(id) === String(value);
            return (
              <li key={id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => pick(id)}
                  className={`w-full flex items-center px-3 text-left transition
                    ${compact ? 'py-1.5 text-xs gap-1.5' : 'py-2 text-sm gap-2.5'}
                    ${isActive ? 'bg-cc-mint text-cc-forest font-semibold' : 'text-cc-forest hover:bg-gray-50'}`}
                >
                  <CategoryIcon iconKey={c.icon} color={c.color} className={iconClass} size={iconSize} />
                  <span className="truncate">{translateDynamicText(c.name, language)}</span>
                </button>
              </li>
            );
          })}
          {categories.length === 0 && (
            <li className="px-3 py-3 text-xs text-cc-muted text-center">No categories</li>
          )}
        </ul>
      )}
    </div>
  );
}

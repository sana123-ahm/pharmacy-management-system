import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  items: { id: number; name: string }[];
  value: number | null;
  onChange: (id: number | null) => void;
  onCreateNew?: () => void;
  error?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder,
  items,
  value,
  onChange,
  onCreateNew,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrer les items selon la recherche
  const filtered = items.filter(item =>
    (item.name || '').toLowerCase().includes((search || '').toLowerCase())
  );

  // Item sélectionné
  const selected = items.find(item => item.id === value);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      <div ref={dropdownRef} className="relative">
        <div
          className={`w-full px-4 py-2 border rounded-lg cursor-pointer flex items-center justify-between ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${isOpen ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={selected ? 'text-gray-900' : 'text-gray-500'}>
            {selected ? selected.name : placeholder}
          </span>
          <ChevronDown size={20} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {/* Barre de recherche */}
            <div className="p-2 border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            {/* Liste des items */}
            <div className="max-h-48 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map(item => (
                  <div
                    key={item.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                      value === item.id ? 'bg-blue-50 font-semibold' : ''
                    }`}
                    onClick={() => {
                      onChange(item.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    {item.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500 text-sm">Aucun résultat</div>
              )}
            </div>

            {/* Bouton ajouter nouveau */}
            {onCreateNew && (
              <div className="border-t border-gray-200 p-2">
                <button
                  onClick={() => {
                    onCreateNew();
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded text-left"
                >
                  + Ajouter nouveau
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

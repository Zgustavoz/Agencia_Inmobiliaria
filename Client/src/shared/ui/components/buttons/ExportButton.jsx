import { generarExcel, generarHTML, generarPDF } from '../utils/index';
import { useState, useRef, useEffect } from 'react';
import { Download, FileText, Sheet, Code } from 'lucide-react';

export const ExportButton = ({ empresa, titulo, metadata, secciones, onExport }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const opciones = [
    {
      label: 'Exportar PDF',
      icon: FileText,
      color: 'text-red-600',
      bg: 'hover:bg-red-50',
      action: () => {
        generarPDF({ empresa, titulo, metadata, secciones, nombreArchivo: `${titulo}.pdf` });
        onExport?.('pdf');
        setOpen(false);
      },
    },
    {
      label: 'Exportar Excel',
      icon: Sheet,
      color: 'text-green-600',
      bg: 'hover:bg-green-50',
      action: () => {
        generarExcel({ empresa, titulo, metadata, secciones, nombreArchivo: `${titulo}.xlsx` });
        onExport?.('excel');
        setOpen(false);
      },
    },
    {
      label: 'Exportar HTML',
      icon: Code,
      color: 'text-blue-600',
      bg: 'hover:bg-blue-50',
      action: () => {
        generarHTML({ empresa, titulo, metadata, secciones, nombreArchivo: `${titulo}.html` });
        onExport?.('html');
        setOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
      >
        <Download size={16} />
        Exportar
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden animate-slideDown">
          {opciones.map(({ label, icon: Icon, color, bg, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${color} ${bg} transition-all duration-200 hover:pl-5`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportButton;
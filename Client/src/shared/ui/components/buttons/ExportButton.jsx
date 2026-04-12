import { useState, useRef, useEffect } from "react"
import { Download, FileText, FileSpreadsheet, Code } from "lucide-react"

export const ExportButton = ({ onExportPDF, onExportExcel, onExportCSV }) => {
  const [open, setOpen] = useState(false)
  const ref             = useRef(null)

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-(--outline-variant)/40 bg-(--surface-container-lowest) text-(--on-surface-variant) hover:bg-(--surface-container) transition-colors"
      >
        <Download size={15} />
        Exportar
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-(--surface-container-lowest) border border-(--outline-variant)/30 rounded-lg shadow-lg z-10 overflow-hidden">
          {onExportPDF && (
            <button
              type="button"
              onClick={() => { onExportPDF(); setOpen(false) }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-(--on-surface-variant) hover:bg-(--surface-container) transition-colors"
            >
              <FileText size={14} />
              PDF
            </button>
          )}
          {onExportExcel && (
            <button
              type="button"
              onClick={() => { onExportExcel(); setOpen(false) }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-(--on-surface-variant) hover:bg-(--surface-container) transition-colors"
            >
              <FileSpreadsheet size={14} />
              Excel
            </button>
          )}
          {onExportCSV && (
            <button
              type="button"
              onClick={() => { onExportCSV(); setOpen(false) }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-(--on-surface-variant) hover:bg-(--surface-container) transition-colors"
            >
              <Code size={14} />
              CSV
            </button>
          )}
        </div>
      )}
    </div>
  )
}
import { useState, useEffect } from "react";
import { Plus, Search, Building2, Home, Key } from "lucide-react";
import { usePropiedades } from "../hooks/usePropiedades";
import { PropiedadTable } from "../components/PropiedadTable";
import { PropiedadForm } from "../components/PropiedadForm";
import { Loading } from "../../../../shared/ui";

export const PropiedadPage = () => {
  const [viewMode, setViewMode] = useState("list");
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);

  // PASO 1: Extraemos stats de la llamada al hook
  const { propiedades, isLoading, stats, refetch } = usePropiedades(search);

  const handleEdit = (propiedad) => {
    setPropiedadSeleccionada(propiedad);
    setViewMode("form");
  };

  const handleCreateNew = () => {
    setPropiedadSeleccionada(null);
    setViewMode("form");
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // EL CAMBIO CLAVE: 
  // No bloquees TODA la página si solo estamos buscando
  if (isLoading && viewMode === "list" && search === "") return <Loading />;
  return (
    <div className="p-8 bg-[#F8F9FB] min-h-screen font-sans text-neutral-600">
      {viewMode === "list" ? (
        <div className="max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-bold text-neutral-800 tracking-tight">Inventario de Propiedades</h1>
              <div className="flex gap-4 mt-2">
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">Portfolio</span>
                <span className="text-[10px] font-black uppercase text-neutral-400">Market Insights(proximamente )</span>
              </div>
            </div>
            <button onClick={handleCreateNew} className="bg-[#0052CC] hover:bg-[#0041a3] text-white px-7 py-3 rounded-lg font-bold text-sm shadow-xl shadow-blue-100 flex items-center gap-2 transition-all active:scale-95">
              <Plus size={18} /> Añadir Nueva Propiedad
            </button>
          </div>

          {/* PASO 2: Tarjetas con datos REALES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total inmuebles</p>
                <p className="text-2xl font-black text-neutral-800">{stats.total}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <Home size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Para Vender</p>
                <p className="text-2xl font-black text-neutral-800">{stats.ventas}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <Key size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Para Rentar</p>
                <p className="text-2xl font-black text-neutral-800">{stats.rentas}</p>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-50 flex justify-between items-center bg-white">
              <h2 className="text-sm font-bold text-neutral-800">Portfolio Actual</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300" size={16} />
                <input
                  type="text"
                  placeholder="Search listings..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-50 border-none rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                  value={inputValue} // <--- Usa el estado rápido
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </div>
            <div className="p-2">
              <PropiedadTable data={propiedades} onEdit={handleEdit} />
            </div>
          </div>
        </div>
      ) : (
        <PropiedadForm
          propiedadAEditar={propiedadSeleccionada}
          onCancel={() => setViewMode("list")}
          onSuccess={() => { setViewMode("list"); refetch(); }}
        />
      )}
    </div>
  );
};
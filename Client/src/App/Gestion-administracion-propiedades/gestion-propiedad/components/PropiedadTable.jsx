import { Edit, Trash2, MapPin, Ruler, BedDouble, Bath } from "lucide-react";

export const PropiedadTable = ({ data, onEdit }) => {
  const items = Array.isArray(data) ? data : data?.results || [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2 px-4">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black">
            <th className="px-6 py-4">Inmueble</th>
            <th className="px-6 py-4 hidden lg:table-cell">Detalles</th>
            <th className="px-6 py-4">Precio</th>
            <th className="px-6 py-4 text-right text-blue-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((prop) => (
            <tr key={prop.id_propiedad} className="bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-all group">
              <td className="px-6 py-4 rounded-l-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-neutral-100 flex-shrink-0 overflow-hidden border border-neutral-50">
                    {prop.imagenes?.[0] ? (
                      <img src={prop.imagenes[0].url_imagen} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300 bg-neutral-50 font-bold text-[10px]">NO PIC</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-neutral-800 text-sm leading-tight mb-1 uppercase tracking-tight">{prop.titulo}</h4>
                    <span className="bg-neutral-900 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                      {prop.codigo_propiedad}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 hidden lg:table-cell text-neutral-500">
                <div className="flex gap-4 items-center">
                  <span className="flex items-center gap-1 text-[11px] font-bold"><BedDouble size={14}/> {prop.dormitorios}</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold"><Bath size={14}/> {prop.banos}</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold"><Ruler size={14}/> {prop.superficie_total_m2}m²</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-black text-neutral-800">${prop.precio}</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase">{prop.modalidad_operacion}</p>
              </td>
              <td className="px-6 py-4 text-right rounded-r-2xl">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(prop)} className="p-2.5 bg-neutral-50 text-neutral-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm">
                    <Edit size={16} />
                  </button>
                  <button className="p-2.5 bg-neutral-50 text-neutral-400 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
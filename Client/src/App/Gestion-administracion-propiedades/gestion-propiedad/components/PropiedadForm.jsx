import { useState, useEffect } from "react";
import { Save, Upload, X, MapPin, Home, DollarSign, Maximize, Bed, Bath, Layers } from "lucide-react";
import { createPropiedad,updatePropiedad } from "../api/propiedadApi";
import { getZonas, getMonedas } from "../api/dataMaestraApi";

export const PropiedadForm = ({ onCancel, onSuccess,propiedadAEditar }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [monedas, setMonedas] = useState([]);

  const [formData, setFormData] = useState({
    codigo_propiedad: "",
    titulo: "",
    descripcion: "",
    tipo_inmueble: "Luxury Villa",
    id_modalidad: 1,
    modalidad_operacion: "Para Rentar",
    zona: "", 
    moneda: "",
    precio: "",
    expensas: 0,
    superficie_total_m2: "",
    superficie_construida_m2: "",
    ambientes: 0,
    dormitorios: 0,
    banos: 0,
    garajes: 0,
    amoblado: false,
  });

  //para editar mande los datos al formulario
  useEffect(() => {
    if (propiedadAEditar) {
      setFormData({
        codigo_propiedad: propiedadAEditar.codigo_propiedad || "",
        titulo: propiedadAEditar.titulo || "",
        descripcion: propiedadAEditar.descripcion || "",
        tipo_inmueble: propiedadAEditar.tipo_inmueble || "Luxury Villa",
        id_modalidad: propiedadAEditar.id_modalidad || 1,
        modalidad_operacion: propiedadAEditar.modalidad_operacion || "Para Rentar",
        // Extraemos IDs si vienen como objetos desde Django
        zona: propiedadAEditar.zona?.id_zona || propiedadAEditar.zona || "",
        moneda: propiedadAEditar.moneda?.id_moneda || propiedadAEditar.moneda || "",
        precio: propiedadAEditar.precio || "",
        superficie_total_m2: propiedadAEditar.superficie_total_m2 || "",
        dormitorios: propiedadAEditar.dormitorios || 0,
        banos: propiedadAEditar.banos || 0,
        // ... añade cualquier otro campo que necesites
      });
    }
  }, [propiedadAEditar]);
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Llamamos a tus archivos de API
        const resZonas = await getZonas();
        const resMonedas = await getMonedas();

        // Depuración: Si abres la consola (F12) verás qué está llegando realmente
        console.log("Datos Zonas:", resZonas);
        console.log("Datos Monedas:", resMonedas);

        // Extraemos la lista (manejando si viene con .results o directo)
        const listaZonas = resZonas.results || resZonas;
        const listaMonedas = resMonedas.results || resMonedas;

        setZonas(Array.isArray(listaZonas) ? listaZonas : []);
        setMonedas(Array.isArray(listaMonedas) ? listaMonedas : []);

        setFormData(prev => ({
          ...prev,
          zona: prev.zona || (listaZonas[0]?.id_zona || ""),
          moneda: prev.moneda || (listaMonedas[0]?.id_moneda || "")
        }));
      } catch (error) {
        console.error("Error cargando datos de la base:", error);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

    const handleSave = async () => {
  if (!formData.codigo_propiedad || formData.codigo_propiedad.trim() === "") {
    return alert("El código de propiedad es obligatorio");
  }

  setIsSaving(true);
  const data = new FormData();
  
  // Llenado de datos (se mantiene igual)
  data.append("codigo_propiedad", formData.codigo_propiedad);
  data.append("titulo", formData.titulo);
  data.append("descripcion", formData.descripcion);
  data.append("precio", formData.precio || 0);
  data.append("tipo_inmueble", formData.tipo_inmueble);
  data.append("zona", formData.zona); 
  data.append("moneda", formData.moneda);
  data.append("id_modalidad", formData.id_modalidad || 1);
  data.append("modalidad_operacion", formData.modalidad_operacion);
  data.append("ambientes", formData.ambientes || 0);
  data.append("dormitorios", formData.dormitorios || 0);
  data.append("banos", formData.banos || 0);
  data.append("superficie_total_m2", formData.superficie_total_m2 || 0);

  selectedFiles.forEach((file) => {
    data.append("imagenes_input", file);
  });

  try {
    // --- LÓGICA DE DECISIÓN AQUÍ ---
    if (propiedadAEditar && propiedadAEditar.id_propiedad) {
      // SI ESTAMOS EDITANDO: Usamos updatePropiedad (PUT)
      await updatePropiedad(propiedadAEditar.id_propiedad, data);
      alert("¡Actualizado con éxito!");
    } else {
      // SI ES NUEVA: Usamos createPropiedad (POST)
      await createPropiedad(data);
      alert("¡Registrado con éxito!");
    }
    
    onSuccess();
  } catch (error) {
    console.error("Respuesta del servidor:", error.response?.data);
    // Mostrar el error de forma más legible
    const serverErrors = error.response?.data;
    alert("Error al guardar: " + (typeof serverErrors === 'object' ? JSON.stringify(serverErrors) : serverErrors));
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="max-w-6xl mx-auto bg-[#F8F9FB] min-h-screen p-6 font-sans text-neutral-600">
      {/* Header Estilo Skyline */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Detalles de Propiedad</h1>
          <p className="text-sm text-neutral-400">Edita o registra la propiedad</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-6 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-700">Cancel</button>
          <button onClick={handleSave} disabled={isSaving} className="bg-[#0052CC] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-lg hover:bg-[#0041a3] transition-all">
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sección 1: Basic Information */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-[#0052CC] text-[10px] font-black uppercase tracking-widest mb-6">Informacion Basica</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-400 mb-1 block">Título de la Propiedad</label>
                <input name="titulo" value={formData.titulo}  onChange={handleChange} className="w-full p-3 bg-neutral-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="The Glass Pavilion" />               
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-400 mb-1 block">Código de Propiedad</label>
                <input name="codigo_propiedad"value={formData.codigo_propiedad} onChange={handleChange} placeholder="CÓDIGO MANUAL"  className="w-full p-3 bg-neutral-50 rounded-xl text-sm font-bold border-none outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-400 mb-1 block">Tipo de propiedad</label>
                  <select name="tipo_inmueble" value={formData.tipo_inmueble} onChange={handleChange} className="w-full p-3 bg-neutral-50 border-none rounded-xl text-sm outline-none">
                    <option value="Luxury Villa">Apartamento</option>
                    <option value="Apartment">Casa </option>
                    <option value="Industrial Loft">Oficina</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 mb-1 block">Listado de Estados</label>
                  <select name="modalidad_operacion" onChange={handleChange} className="w-full p-3 bg-neutral-50 border-none rounded-xl text-sm outline-none">
                    <option value="Para Rentar">Para Rentar</option>
                    <option value="Para Vender">Para Vender</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-400 mb-1 block">Descripcion</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full p-4 bg-neutral-50 border-none rounded-xl text-sm h-32 outline-none" placeholder="A masterpiece of modern architecture..." />
              </div>
            </div>
          </div>

          {/* Sección 2: Key Features (Ambientes, Baños, etc) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-[#0052CC] text-[10px] font-black uppercase tracking-widest mb-6">Caracterizticas Clave</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-neutral-50 p-4 rounded-xl text-center">
                <Bed className="mx-auto mb-2 text-blue-500" size={20} />
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Dormitorios</label>
                <input name="dormitorios" type="number" value={formData.dormitorios} onChange={handleChange} className="bg-transparent text-center font-bold text-neutral-800 outline-none w-full" defaultValue={0} />
              </div>
              <div className="bg-neutral-50 p-4 rounded-xl text-center">
                <Bath className="mx-auto mb-2 text-blue-500" size={20} />
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Baños</label>
                <input name="banos" type="number" value={formData.banos} onChange={handleChange} className="bg-transparent text-center font-bold text-neutral-800 outline-none w-full" defaultValue={0} />
              </div>
              <div className="bg-neutral-50 p-4 rounded-xl text-center">
                <Maximize className="mx-auto mb-2 text-blue-500" size={20} />
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Metros cuadrados</label>
                <input name="superficie_total_m2" type="number" value={formData.superficie_total_m2} onChange={handleChange} className="bg-transparent text-center font-bold text-neutral-800 outline-none w-full" placeholder="8400" />
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Multimedia y Ubicación */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-[#0052CC] text-[10px] font-black uppercase tracking-widest mb-6">Galeria de fotos</h3>
            <div className="border-2 border-dashed border-neutral-100 rounded-2xl p-10 text-center hover:bg-neutral-50 cursor-pointer relative">
               <Upload className="mx-auto text-neutral-300 mb-2" />
               <p className="text-xs font-bold text-neutral-400 uppercase">Cargar Imagenes</p>
               <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)])} />
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {selectedFiles.map((f, i) => (
                <div key={i} className="text-[10px] bg-neutral-100 px-2 py-1 rounded-md">{f.name.substring(0,10)}...</div>
              ))}
            </div>
          </div>
          {/* Columna Derecha: Location & Finance */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
          <h3 className="text-[#0052CC] text-[10px] font-black uppercase tracking-widest mb-6">Locacion y Finanzacion</h3>
          <div className="space-y-4">
            
            {/* SELECTOR DE ZONA */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Ubicación (Zona)</label>
              <select 
                name="zona" 
                value={formData.zona} 
                onChange={handleChange} 
                className="w-full p-3 bg-neutral-50 border-none rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Seleccione una zona...</option>
                {zonas.length > 0 ? (
                  zonas.map((z) => (
                    <option key={z.id_zona} value={z.id_zona}>
                      {z.nombre || z.zona} {/* Intentamos leer 'nombre' o 'zona' según tu Serializer */}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando zonas...</option>
                )}
              </select>
            </div>

            {/* SELECTOR DE MONEDA */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Moneda</label>
              <select 
                name="moneda" 
                value={formData.moneda} 
                onChange={handleChange} 
                className="w-full p-3 bg-neutral-50 border-none rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Seleccione moneda...</option>
                {monedas.length > 0 ? (
                  monedas.map((m) => (
                    <option key={m.id_moneda} value={m.id_moneda}>
                      {m.nombre} ({m.simbolo})
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando monedas...</option>
                )}
              </select>
            </div>

            {/* PRECIO */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Precio del Inmueble </label>
              <input 
                name="precio" 
                value={formData.precio}
                type="number" 
                onChange={handleChange} 
                className="w-full p-3 bg-neutral-50 border-none rounded-xl text-xs font-bold outline-none" 
                placeholder="0.00" 
              />
            </div>
          </div>
        </div>
    </div>

      </div>
    </div>
  );
};
import { useState, useEffect, useRef } from "react";
import { Save, Upload, X, MapPin, Home, DollarSign, Maximize, Bed, Bath, Layers, Map as MapIcon } from "lucide-react";
import { createPropiedad, updatePropiedad } from "../api/propiedadApi";
import { getZonas, getMonedas } from "../api/dataMaestraApi";
import MapContainer from "../../../../shared/map/components/MapContainer";
import mapboxgl from 'mapbox-gl';

export const PropiedadForm = ({ onCancel, onSuccess, propiedadAEditar }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

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
    latitud: "",
    longitud: "",
  });

  // Manejar previews de imágenes nuevas
  useEffect(() => {
    if (selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(objectUrls);

    // Free memory when component unmounts
    return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
  }, [selectedFiles]);

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
        zona: propiedadAEditar.zona?.id_zona || propiedadAEditar.zona || "",
        moneda: propiedadAEditar.moneda?.id_moneda || propiedadAEditar.moneda || "",
        precio: propiedadAEditar.precio || "",
        expensas: propiedadAEditar.expensas || 0,
        superficie_total_m2: propiedadAEditar.superficie_total_m2 || "",
        superficie_construida_m2: propiedadAEditar.superficie_construida_m2 || "",
        ambientes: propiedadAEditar.ambientes || 0,
        dormitorios: propiedadAEditar.dormitorios || 0,
        banos: propiedadAEditar.banos || 0,
        garajes: propiedadAEditar.garajes || 0,
        amoblado: propiedadAEditar.amoblado || false,
        latitud: propiedadAEditar.latitud || "",
        longitud: propiedadAEditar.longitud || "",
      });
      setExistingImages(propiedadAEditar.imagenes || []);
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
  
  // Llenado de datos
  data.append("codigo_propiedad", formData.codigo_propiedad);
  data.append("titulo", formData.titulo);
  data.append("descripcion", formData.descripcion);
  data.append("precio", formData.precio || 0);
  data.append("expensas", formData.expensas || 0);
  data.append("tipo_inmueble", formData.tipo_inmueble);
  data.append("zona", formData.zona); 
  data.append("moneda", formData.moneda);
  data.append("id_modalidad", formData.id_modalidad || 1);
  data.append("modalidad_operacion", formData.modalidad_operacion);
  data.append("ambientes", formData.ambientes || 0);
  data.append("dormitorios", formData.dormitorios || 0);
  data.append("banos", formData.banos || 0);
  data.append("garajes", formData.garajes || 0);
  data.append("superficie_total_m2", formData.superficie_total_m2 || 0);
  data.append("superficie_construida_m2", formData.superficie_construida_m2 || 0);
  data.append("amoblado", formData.amoblado);
  data.append("latitud", formData.latitud);
  data.append("longitud", formData.longitud);

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

  const onMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
    
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    } else {
      markerRef.current = new mapboxgl.Marker({ color: '#0052CC', draggable: true })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      
      markerRef.current.on('dragend', () => {
        const { lng, lat } = markerRef.current.getLngLat();
        setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
      });
    }
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
    
    // 1. MODO EDICIÓN: Si ya tiene coordenadas en el formData, posicionar marcador y DIRIGIRSE allí
    if (formData.latitud && formData.longitud) {
      const lng = parseFloat(formData.longitud);
      const lat = parseFloat(formData.latitud);
      
      console.log("Modo Edición: Dirigiendo mapa a", lat, lng);

      if (markerRef.current) markerRef.current.remove();

      markerRef.current = new mapboxgl.Marker({ color: '#0052CC', draggable: true })
        .setLngLat([lng, lat])
        .addTo(map);
      
      markerRef.current.on('dragend', () => {
        const { lng, lat } = markerRef.current.getLngLat();
        setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
      });

      // Asegurar que el mapa se mueva a la posición con un pequeño delay para que el contenedor esté listo
      setTimeout(() => {
        map.resize();
        map.flyTo({ 
          center: [lng, lat], 
          zoom: 16, 
          essential: true,
          duration: 2000 
        });
      }, 500);
    } 
    // 2. MODO CREACIÓN...
    else if (!propiedadAEditar && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, latitud: latitude, longitud: longitude }));
        
        if (markerRef.current) markerRef.current.remove();
        
        markerRef.current = new mapboxgl.Marker({ color: '#0052CC', draggable: true })
          .setLngLat([longitude, latitude])
          .addTo(map);
        
        markerRef.current.on('dragend', () => {
          const { lng, lat } = markerRef.current.getLngLat();
          setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
        });
          
        map.flyTo({ center: [longitude, latitude], zoom: 14 });
      }, (err) => {
        console.warn("No se pudo obtener la ubicación automáticamente:", err.message);
      });
    }

    // 3. Escuchar geolocate...
    map.on('geolocate', (e) => {
      const { longitude, latitude } = e.coords;
      setFormData(prev => ({ ...prev, latitud: latitude, longitud: longitude }));
      
      if (markerRef.current) {
        markerRef.current.setLngLat([longitude, latitude]);
      } else {
        markerRef.current = new mapboxgl.Marker({ color: '#0052CC', draggable: true })
          .setLngLat([longitude, latitude])
          .addTo(map);
        
        markerRef.current.on('dragend', () => {
          const { lng, lat } = markerRef.current.getLngLat();
          setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
        });
      }
    });
  };

  const goToSavedLocation = () => {
    if (mapRef.current && formData.latitud && formData.longitud) {
      const lng = parseFloat(formData.longitud);
      const lat = parseFloat(formData.latitud);
      
      // Asegurar que el marcador exista y esté en la posición correcta
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      } else {
        markerRef.current = new mapboxgl.Marker({ color: '#0052CC', draggable: true })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);
        
        markerRef.current.on('dragend', () => {
          const { lng, lat } = markerRef.current.getLngLat();
          setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
        });
      }

      mapRef.current.resize();
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        essential: true,
        duration: 1500
      });
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
                  <select name="modalidad_operacion" value={formData.modalidad_operacion} onChange={handleChange} className="w-full p-3 bg-neutral-50 border-none rounded-xl text-sm outline-none">
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
            <div className="grid grid-cols-2 gap-4 mb-6">
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
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">M² Total</label>
                <input name="superficie_total_m2" type="number" value={formData.superficie_total_m2} onChange={handleChange} className="bg-transparent text-center font-bold text-neutral-800 outline-none w-full" placeholder="8400" />
              </div>
              <div className="bg-neutral-50 p-4 rounded-xl text-center">
                <Maximize className="mx-auto mb-2 text-blue-500" size={20} />
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">M² Construidos</label>
                <input name="superficie_construida_m2" type="number" value={formData.superficie_construida_m2} onChange={handleChange} className="bg-transparent text-center font-bold text-neutral-800 outline-none w-full" placeholder="7000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-2">Garajes</label>
                <input name="garajes" type="number" value={formData.garajes} onChange={handleChange} className="w-full p-3 bg-neutral-50 border-none rounded-xl text-sm font-bold outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase block mb-2">Ambientes</label>
                <input name="ambientes" type="number" value={formData.ambientes} onChange={handleChange} className="w-full p-3 bg-neutral-50 border-none rounded-xl text-sm font-bold outline-none" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <input name="amoblado" type="checkbox" checked={formData.amoblado} onChange={handleChange} className="w-4 h-4 rounded cursor-pointer" />
              <label className="text-[10px] font-bold text-neutral-400 uppercase ml-2">Amoblado</label>
            </div>
          </div>

          {/* Sección 3: Mapa de Ubicación */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#0052CC] text-[10px] font-black uppercase tracking-widest">Ubicación Exacta</h3>
              <div className="flex gap-4 items-center">
                <div className="flex gap-4 text-[10px] font-bold text-neutral-400">
                  <span>LAT: {formData.latitud || '---'}</span>
                  <span>LNG: {formData.longitud || '---'}</span>
                </div>
                {formData.latitud && formData.longitud && (
                  <button 
                    type="button"
                    onClick={goToSavedLocation}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-[#0052CC] rounded-full text-[10px] font-bold hover:bg-blue-100 transition-colors"
                  >
                    <MapPin size={12} />
                    Ver en Mapa
                  </button>
                )}
              </div>
            </div>
            <div className="h-[400px] rounded-2xl overflow-hidden border border-neutral-100 relative">
              <MapContainer 
                onLoad={onMapLoad}
                onMapClick={onMapClick}
                center={formData.longitud && formData.latitud ? [formData.longitud, formData.latitud] : undefined}
                zoom={formData.latitud ? 15 : undefined}
              />
              {!formData.latitud && (
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                  <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <MapPin className="text-blue-500" size={16} />
                    <span className="text-xs font-bold">Click en el mapa para marcar ubicación</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Multimedia y Ubicación */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
            <h3 className="text-[#0052CC] text-[10px] font-black uppercase tracking-widest mb-6">Galeria de fotos</h3>
            <div className="border-2 border-dashed border-neutral-100 rounded-2xl p-10 text-center hover:bg-neutral-50 cursor-pointer relative mb-4">
               <Upload className="mx-auto text-neutral-300 mb-2" />
               <p className="text-xs font-bold text-neutral-400 uppercase">Cargar Imagenes</p>
               <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)])} />
            </div>
            
            {/* Previsualización de Imágenes Nuevas */}
            {previews.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-neutral-400 uppercase mb-2">Nuevas Imágenes</p>
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={url} alt={`preview ${i}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Imágenes Existentes (Modo Edición) */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase mb-2">Imágenes Actuales</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((img, i) => (
                    <div key={img.id_imagen || i} className="aspect-square rounded-lg overflow-hidden border border-neutral-100">
                      <img src={img.url_imagen} alt={`actual ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
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

            {/* EXPENSAS */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase">Expensas/Mantenimiento</label>
              <input 
                name="expensas" 
                value={formData.expensas}
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
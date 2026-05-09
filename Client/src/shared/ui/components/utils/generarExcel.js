import * as XLSX from 'xlsx';

const generarExcel = (config) => {
  const {
    empresa = 'MI EMPRESA',
    titulo = 'REPORTE',
    metadata = {},
    secciones = [],
    nombreArchivo = 'reporte.xlsx',
  } = config;

  const wb = XLSX.utils.book_new();

  secciones.forEach((seccion, idx) => {
    const { 
      titulo: tituloSeccion = 'Hoja', 
      columnas = [], 
      datos = [], 
      mapearDatos = null 
    } = seccion;

    const filas = [];

    // Encabezado empresa y título
    filas.push([empresa]);
    filas.push([titulo]);
    filas.push([tituloSeccion]);
    filas.push([]);

    // Metadata
    Object.entries(metadata).forEach(([key, value]) => {
      filas.push([`${key}: ${value}`]);
    });
    if (Object.keys(metadata).length) filas.push([]);

    // Headers
    filas.push(columnas);

    // Datos
    const datosProcesados = mapearDatos
      ? datos.map(mapearDatos)
      : datos.map(item => columnas.map(col => {
          const clave = col.toLowerCase().replace(/ /g, '_');
          const valor = item[clave] ?? item[col] ?? '-';
          return typeof valor === 'boolean' ? (valor ? 'Activo' : 'Inactivo') : valor;
        }));

    datosProcesados.forEach(fila => filas.push(fila));

    const ws = XLSX.utils.aoa_to_sheet(filas);
    ws['!cols'] = columnas.map(() => ({ wch: 22 }));

    // Nombre de hoja único
    const nombreHoja = `${tituloSeccion.slice(0, 28)}_${idx + 1}`;
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
  });

  XLSX.writeFile(wb, nombreArchivo);
};

export default generarExcel;
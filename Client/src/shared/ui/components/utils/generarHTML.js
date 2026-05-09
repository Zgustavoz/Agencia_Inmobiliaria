const generarHTML = (config) => {
  const {
    empresa = 'MI EMPRESA',
    titulo = 'REPORTE',
    metadata = {},
    secciones = [],
    nombreArchivo = 'reporte.html',
  } = config;

  // Construir HTML
  let htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo} - ${empresa}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 40px 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            color: white;
            padding: 30px;
        }
        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header h2 {
            font-size: 18px;
            opacity: 0.9;
        }
        .metadata {
            padding: 20px 30px;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        .metadata-item {
            font-size: 14px;
            color: #334155;
        }
        .metadata-item strong {
            color: #1e293b;
        }
        .seccion {
            padding: 30px;
            border-bottom: 1px solid #e2e8f0;
        }
        .seccion:last-child {
            border-bottom: none;
        }
        .seccion h3 {
            font-size: 20px;
            color: #1e293b;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3b82f6;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th {
            background: #3b82f6;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 14px;
            font-weight: 600;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
            color: #334155;
        }
        tr:hover {
            background: #f8fafc;
        }
        .no-data {
            text-align: center;
            padding: 40px;
            color: #94a3b8;
            font-style: italic;
        }
        .footer {
            padding: 20px 30px;
            background: #f8fafc;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
        @media print {
            body {
                background: white;
                padding: 0;
            }
            .header {
                background: #2563eb;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            th {
                background: #3b82f6;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${empresa}</h1>
            <h2>${titulo}</h2>
        </div>
  `;

  // Metadata
  if (Object.keys(metadata).length > 0) {
    htmlContent += `<div class="metadata">`;
    Object.entries(metadata).forEach(([key, value]) => {
      htmlContent += `
        <div class="metadata-item">
            <strong>${key}:</strong> ${value}
        </div>
      `;
    });
    htmlContent += `</div>`;
  }

  // Secciones
  secciones.forEach((seccion) => {
    const { 
      titulo: tituloSeccion = 'Sección', 
      columnas = [], 
      datos = [], 
      mapearDatos = null 
    } = seccion;

    htmlContent += `
        <div class="seccion">
            <h3>${tituloSeccion}</h3>
    `;

    // Preparar datos
    const datosProcesados = mapearDatos
      ? datos.map(mapearDatos)
      : datos.map(item => columnas.map(col => {
          const clave = col.toLowerCase().replace(/ /g, '_');
          const valor = item[clave] ?? item[col] ?? '-';
          return typeof valor === 'boolean' ? (valor ? 'Activo' : 'Inactivo') : valor;
        }));

    if (datosProcesados.length > 0) {
      htmlContent += `
        <table>
            <thead>
                <tr>
      `;
      columnas.forEach(col => {
        htmlContent += `<th>${col}</th>`;
      });
      htmlContent += `
                </tr>
            </thead>
            <tbody>
      `;
      
      datosProcesados.forEach(fila => {
        htmlContent += `<tr>`;
        fila.forEach(celda => {
          htmlContent += `<td>${celda}</td>`;
        });
        htmlContent += `</tr>`;
      });
      
      htmlContent += `
            </tbody>
        </table>
      `;
    } else {
      htmlContent += `<div class="no-data">No hay datos disponibles</div>`;
    }

    htmlContent += `</div>`;
  });

  htmlContent += `
        <div class="footer">
            Reporte generado el ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
  `;

  // Crear blob y descargar
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default generarHTML;
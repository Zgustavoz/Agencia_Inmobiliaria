// Mock data
export const MOCK_AGENTES = [
  {
    id: 1,
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos@inmobiliaria.com",
    rol: "Agente Inmobiliario",
    avatar_color: "bg-blue-500"
  },
  {
    id: 2,
    nombre: "María",
    apellido: "García",
    email: "maria@inmobiliaria.com",
    rol: "Agente Inmobiliario",
    avatar_color: "bg-pink-500"
  },
  {
    id: 3,
    nombre: "Juan",
    apellido: "Martínez",
    email: "juan@inmobiliaria.com",
    rol: "Agente Inmobiliario",
    avatar_color: "bg-green-500"
  },
  {
    id: 4,
    nombre: "Ana",
    apellido: "López",
    email: "ana@inmobiliaria.com",
    rol: "Agente Inmobiliario",
    avatar_color: "bg-purple-500"
  },
  {
    id: 5,
    nombre: "Diego",
    apellido: "Fernández",
    email: "diego@inmobiliaria.com",
    rol: "Agente Inmobiliario",
    avatar_color: "bg-amber-500"
  }
];

export const MOCK_CLIENTES = [
  {
    id: 1,
    nombre: "Empresa XYZ",
    codigo: "CLI-001",
    email: "contacto@xyz.com",
    telefono: "+34 912 345 678",
    estado: "activo",
    agente_asignado: 1,
    fecha_registro: "2026-01-15"
  },
  {
    id: 2,
    nombre: "Constructora ABC",
    codigo: "CLI-002",
    email: "info@abc.com",
    telefono: null,
    estado: "nuevo",
    agente_asignado: null,
    fecha_registro: "2026-05-10"
  },
  {
    id: 3,
    nombre: "Inmuebles Plus",
    codigo: "CLI-003",
    email: "ventas@inmplus.com",
    telefono: "+34 914 567 890",
    estado: "activo",
    agente_asignado: 2,
    fecha_registro: "2026-02-20"
  },
  {
    id: 4,
    nombre: "Grupo Real Estate",
    codigo: "CLI-004",
    email: "admin@groupreal.com",
    telefono: "+34 915 678 901",
    estado: "seguimiento",
    agente_asignado: null,
    fecha_registro: "2026-04-05"
  },
  {
    id: 5,
    nombre: "Desarrollo Urbano",
    codigo: "CLI-005",
    email: "proyecto@urbano.com",
    telefono: "+34 916 789 012",
    estado: "activo",
    agente_asignado: 3,
    fecha_registro: "2026-01-30"
  },
  {
    id: 6,
    nombre: "Consultoría Inmobiliaria",
    codigo: "CLI-006",
    email: "info@consultor.com",
    telefono: "+34 917 890 123",
    estado: "inactivo",
    agente_asignado: null,
    fecha_registro: "2025-12-10"
  },
  {
    id: 7,
    nombre: "Propiedades Premium",
    codigo: "CLI-007",
    email: "premium@propiedades.com",
    telefono: "+34 918 901 234",
    estado: "cerrado",
    agente_asignado: 4,
    fecha_registro: "2025-11-01"
  },
  {
    id: 8,
    nombre: "Nueva Inversión SL",
    codigo: "CLI-008",
    email: null,
    telefono: "+34 919 012 345",
    estado: "nuevo",
    agente_asignado: null,
    fecha_registro: "2026-05-08"
  }
];

// Helper to detect incomplete fields
const detectarCamposIncompletos = (cliente) => {
  const campos = [];
  if (!cliente.email) campos.push("email");
  if (!cliente.telefono) campos.push("telefono");
  if (!cliente.codigo) campos.push("codigo");
  return campos;
};

export const agenteAPI = {
  obtenerClientesConAgentes: (buscar = "", filtroEstado = "todos") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtrados = [...MOCK_CLIENTES];

        if (buscar.trim()) {
          const query = buscar.toLowerCase();
          filtrados = filtrados.filter((cliente) => {
            const nombre = (cliente.nombre || "").toLowerCase();
            const email = (cliente.email || "").toLowerCase();
            const codigo = (cliente.codigo || "").toLowerCase();
            return (
              nombre.includes(query) ||
              email.includes(query) ||
              codigo.includes(query)
            );
          });
        }

        if (filtroEstado !== "todos") {
          filtrados = filtrados.filter(
            (cliente) => cliente.estado === filtroEstado
          );
        }

        const clientesConAgentes = filtrados.map((cliente) => ({
          ...cliente,
          agente_info: cliente.agente_asignado
            ? MOCK_AGENTES.find((a) => a.id === cliente.agente_asignado)
            : null
        }));

        resolve(clientesConAgentes);
      }, 600);
    });
  },

  obtenerAgentes: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_AGENTES]);
      }, 400);
    });
  },

  // Buscar coincidencias parciales y marcar campos incompletos
  buscarClientesParciales: (buscar = "") => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const q = buscar.toLowerCase().trim();
        if (!q) {
          resolve([]);
          return;
        }

        const encontrados = MOCK_CLIENTES.filter((c) => {
          const nombre = (c.nombre || "").toLowerCase();
          const email = (c.email || "").toLowerCase();
          const codigo = (c.codigo || "").toLowerCase();
          return (
            nombre.includes(q) ||
            email.includes(q) ||
            codigo.includes(q)
          );
        }).map((cliente) => ({
          ...cliente,
          incompleteFields: detectarCamposIncompletos(cliente)
        }));

        resolve(encontrados.slice(0, 8));
      }, 350);
    });
  },

  crearClienteRapido: (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nuevoId = MOCK_CLIENTES.reduce((max, c) => Math.max(max, c.id), 0) + 1;
        const nuevo = {
          id: nuevoId,
          nombre: data.nombre || `Cliente ${nuevoId}`,
          codigo: data.codigo || `CLI-${String(nuevoId).padStart(3, "0")}`,
          email: data.email || null,
          telefono: data.telefono || null,
          estado: data.estado || "nuevo",
          agente_asignado: null,
          fecha_registro: new Date().toISOString().split("T")[0]
        };
        MOCK_CLIENTES.push(nuevo);
        resolve(nuevo);
      }, 450);
    });
  },

  actualizarClientePartial: (clienteId, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cliente = MOCK_CLIENTES.find((c) => c.id === clienteId);
        if (!cliente) {
          reject(new Error("Cliente no encontrado"));
          return;
        }
        Object.assign(cliente, data);
        resolve({ success: true, cliente });
      }, 400);
    });
  },

  asignarAgente: (clienteId, agenteId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cliente = MOCK_CLIENTES.find((c) => c.id === clienteId);
        const agente = MOCK_AGENTES.find((a) => a.id === agenteId);

        if (!cliente || !agente) {
          reject(new Error("Cliente o agente no encontrado"));
          return;
        }

        cliente.agente_asignado = agenteId;
        resolve({
          success: true,
          message: `Agente ${agente.nombre} asignado a ${cliente.nombre}`,
          cliente_actualizado: cliente
        });
      }, 500);
    });
  },

  desasignarAgente: (clienteId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cliente = MOCK_CLIENTES.find((c) => c.id === clienteId);

        if (!cliente) {
          reject(new Error("Cliente no encontrado"));
          return;
        }

        const nombreAnterior = MOCK_AGENTES.find(
          (a) => a.id === cliente.agente_asignado
        )?.nombre;
        cliente.agente_asignado = null;

        resolve({
          success: true,
          message: `Agente ${nombreAnterior} desasignado de ${cliente.nombre}`,
          cliente_actualizado: cliente
        });
      }, 500);
    });
  }
};

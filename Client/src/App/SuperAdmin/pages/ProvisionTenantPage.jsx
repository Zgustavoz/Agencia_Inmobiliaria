import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { provisionTenant } from "../api/superAdminApi";
import { 
  Building2, 
  UserPlus, 
  ArrowRight,
  Package,
  Key,
  Mail,
  User,
  Layout,
  AlignLeft
} from "lucide-react";
import toast from "react-hot-toast";

export const ProvisionTenantPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tenant_nombre: "",
    tenant_descripcion: "",
    tenant_plan: "basico",
    tenant_max_propiedades: 3,
    admin_username: "",
    admin_email: "",
    admin_password: "",
    admin_nombres: "",
    admin_apellidos: ""
  });

  // Lógica para actualizar el límite de propiedades según el plan seleccionado
  useEffect(() => {
    const planDefaults = {
      basico: 3,
      profesional: 20,
      empresa: 100
    };
    
    setFormData(prev => ({
      ...prev,
      tenant_max_propiedades: planDefaults[prev.tenant_plan] || 3
    }));
  }, [formData.tenant_plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tenant_max_propiedades' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await provisionTenant(formData);
      toast.success("Empresa y Administrador creados correctamente");
      navigate("/superadmin/tenants");
    } catch (error) {
      const errorData = error.response?.data;
      if (typeof errorData === 'object') {
        Object.values(errorData).forEach(err => {
          if (Array.isArray(err)) {
            toast.error(err[0]);
          } else {
            toast.error(err);
          }
        });
      } else {
        toast.error("Error al registrar la empresa");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Provisionar Nueva Inmobiliaria</h1>
        <p className="text-slate-500">Registra una nueva empresa y configura su cuenta administrativa en un solo paso.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* SECCIÓN 1: DATOS DE LA EMPRESA */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold border-b border-indigo-100 pb-2">
              <Building2 className="w-5 h-5" />
              <h2>Datos de la Inmobiliaria</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre de la Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    name="tenant_nombre"
                    value={formData.tenant_nombre}
                    onChange={handleChange}
                    type="text" 
                    placeholder="Ej: Inmobiliaria Horizonte"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea 
                    name="tenant_descripcion"
                    value={formData.tenant_descripcion}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Breve descripción de la empresa..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plan de Suscripción</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    name="tenant_plan"
                    value={formData.tenant_plan}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  >
                    <option value="basico">Plan Básico</option>
                    <option value="profesional">Plan Profesional</option>
                    <option value="empresa">Plan Empresa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Límite de Propiedades</label>
                <div className="relative">
                  <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    name="tenant_max_propiedades"
                    value={formData.tenant_max_propiedades}
                    onChange={handleChange}
                    type="number" 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">Se ajusta según el plan, pero puedes cambiarlo manualmente.</p>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: DATOS DEL ADMINISTRADOR */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold border-b border-emerald-100 pb-2">
              <UserPlus className="w-5 h-5" />
              <h2>Cuenta Administradora</h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombres</label>
                  <input 
                    required
                    name="admin_nombres"
                    value={formData.admin_nombres}
                    onChange={handleChange}
                    type="text" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellidos</label>
                  <input 
                    required
                    name="admin_apellidos"
                    value={formData.admin_apellidos}
                    onChange={handleChange}
                    type="text" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    name="admin_email"
                    value={formData.admin_email}
                    onChange={handleChange}
                    type="email" 
                    placeholder="admin@empresa.com"
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username de Acceso</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    name="admin_username"
                    value={formData.admin_username}
                    onChange={handleChange}
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contraseña Temporal</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    name="admin_password"
                    value={formData.admin_password}
                    onChange={handleChange}
                    type="password" 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
          <button 
            type="button"
            onClick={() => navigate("/superadmin/tenants")}
            className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Crear Empresa y Administrador"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

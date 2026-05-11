import { useState } from "react"
import { motion } from "motion/react"

const initialFilters = {
  tipo_inmueble: "",
  precio_min: "",
  precio_max: "",
  dormitorios_min: "",
  banos_min: "",
  ambientes_min: "",
  garajes_min: "",
  terreno_min: "",
  terreno_max: "",
  construccion_min: "",
  construccion_max: "",
  ciudad: "",
  departamento: "",
  amoblado: ""
}

export const FiltersPanel = ({ onApplyFilters }) => {
  const [filtros, setFiltros] = useState(initialFilters)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFiltros((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const limpiar = () => {
    setFiltros(initialFilters)
    onApplyFilters({})
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-2xl bg-white/90 p-5 shadow-xl"
    >
      <div className="grid gap-4 md:grid-cols-3">

        <select
          name="tipo_inmueble"
          value={filtros.tipo_inmueble}
          onChange={handleChange}
          className="rounded-lg border p-2"
        >
          <option value="">Tipo</option>
          <option value="Casa">Casa</option>
          <option value="Departamento">Departamento</option>
        </select>

        <input
          name="precio_min"
          type="number"
          placeholder="Precio mínimo"
          value={filtros.precio_min}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="precio_max"
          type="number"
          placeholder="Precio máximo"
          value={filtros.precio_max}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="dormitorios_min"
          type="number"
          placeholder="Dormitorios mín."
          value={filtros.dormitorios_min}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="banos_min"
          type="number"
          placeholder="Baños mín."
          value={filtros.banos_min}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="ambientes_min"
          type="number"
          placeholder="Ambientes mín."
          value={filtros.ambientes_min}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="garajes_min"
          type="number"
          placeholder="Garajes mín."
          value={filtros.garajes_min}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="terreno_min"
          type="number"
          placeholder="Terreno mín."
          value={filtros.terreno_min}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="terreno_max"
          type="number"
          placeholder="Terreno máx."
          value={filtros.terreno_max}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="construccion_min"
          type="number"
          placeholder="Construcción mín."
          value={filtros.construccion_min}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="construccion_max"
          type="number"
          placeholder="Construcción máx."
          value={filtros.construccion_max}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="ciudad"
          type="text"
          placeholder="Ciudad"
          value={filtros.ciudad}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <input
          name="departamento"
          type="text"
          placeholder="Departamento"
          value={filtros.departamento}
          onChange={handleChange}
          className="rounded-lg border p-2"
        />

        <select
          name="amoblado"
          value={filtros.amoblado}
          onChange={handleChange}
          className="rounded-lg border p-2"
        >
          <option value="">Amoblado</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button" 
          onClick={limpiar}
          className="rounded-lg border px-4 py-2"
        >
          Limpiar
        </button>

        <button
          type="button"
          onClick={() => onApplyFilters(filtros)}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Buscar
        </button>
      </div>
    </motion.div>
  )
}
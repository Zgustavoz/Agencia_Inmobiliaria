import { clientHomeMock } from "../mock/clientHomeMock"
import { getPropiedades } from "../../../Gestion-administracion-propiedades/gestion-propiedad/api/propiedadApi"

export const getClientHomeData = async (filters = {}) => {
  const propiedades = await getPropiedades(filters)

  return {
    hero: {
      title: "Encuentra tu propiedad ideal",
      subtitle: "Compra o alquila fácilmente",
      backgroundImage: clientHomeMock.hero.backgroundImage
    },
    searchModes: ["Comprar", "Alquilar"],
    categories: clientHomeMock.categories,
    featuredListings: propiedades
  }
}

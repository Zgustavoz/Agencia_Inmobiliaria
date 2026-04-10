import { LoaderCircle } from "lucide-react"
import { motion } from "motion/react"
import { HeroSearchSection } from "../components/HeroSearchSection"
import { CategoryBentoSection } from "../components/CategoryBentoSection"
import { FeaturedListingsSection } from "../components/FeaturedListingsSection"
import { useClientHomeQuery } from "../hooks/useClientHomeQuery"

export const ClientHomePage = () => {
  const { data, isLoading, isError } = useClientHomeQuery()

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-(--surface)">
        <div className="inline-flex items-center gap-2 text-(--on-surface-variant)">
          <LoaderCircle className="animate-spin" size={20} />
          Cargando home de cliente...
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="grid min-h-screen place-items-center bg-(--surface)">
        <p className="rounded-xl border border-red-300 bg-red-50 px-5 py-3 text-sm font-medium text-red-700">
          Ocurrio un error al cargar la informacion de la pagina.
        </p>
      </div>
    )
  }

  const MotionMain = motion.main
  const MotionDiv = motion.div

  return (
    <MotionMain
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="min-h-screen bg-(--surface)"
    >
      <MotionDiv
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <HeroSearchSection hero={data.hero} searchModes={data.searchModes} />
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
      >
        <CategoryBentoSection categories={data.categories} />
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        <FeaturedListingsSection listings={data.featuredListings} />
      </MotionDiv>
    </MotionMain>
  )
}

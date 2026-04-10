import { PropertyListingCard } from "../../../../shared/ui/components/PropertyListingCard"
import { motion } from "motion/react"

export const FeaturedListingsSection = ({ listings }) => {
  const MotionDiv = motion.div

  return (
    <section className="bg-(--surface-container-low) py-16">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 md:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-black text-(--on-surface)">Propiedades destacadas</h2>
          <p className="mt-2 text-(--on-surface-variant)">
            Seleccion premium para clientes que buscan calidad y buena ubicacion.
          </p>
        </MotionDiv>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing, index) => (
            <PropertyListingCard key={listing.id} listing={listing} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

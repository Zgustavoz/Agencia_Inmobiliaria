import { BedDouble, Bath, Ruler } from "lucide-react"
import { motion } from "motion/react"

export const PropertyListingCard = ({ listing, index = 0 }) => {
  const MotionArticle = motion.article

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
      className="overflow-hidden rounded-2xl bg-(--surface-container-lowest) shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={listing.image}
          alt={listing.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-(--surface-container-low) px-3 py-1 text-xs font-bold uppercase tracking-wide text-(--on-secondary)">
          {listing.badge}
        </span>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <h3 className="text-xl font-bold text-(--on-surface)">{listing.name}</h3>
          <p className="text-sm text-(--on-surface-variant)">{listing.location}</p>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-(--outline-variant)/30 p-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-(--on-surface)">
            <BedDouble size={16} className="text-(--primary)" /> {listing.beds}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-(--on-surface)">
            <Bath size={16} className="text-(--primary)" /> {listing.baths}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-(--on-surface)">
            <Ruler size={16} className="text-(--primary)" /> {listing.area}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <strong className="text-2xl text-(--primary)">{listing.price}</strong>
          <button
            type="button"
            className="rounded-full bg-(--primary-fixed) px-5 py-2 text-sm font-bold text-(--on-primary-fixed) transition hover:bg-(--primary) hover:text-(--on-primary)"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </MotionArticle>
  )
}

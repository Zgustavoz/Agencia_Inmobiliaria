import { motion } from "motion/react"

export const CategoryBentoSection = ({ categories }) => {
  const MotionDiv = motion.div
  const MotionArticle = motion.article

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-16 md:px-8">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-(--secondary)">Colecciones</p>
          <h2 className="mt-2 text-3xl font-black text-(--on-surface)">Categorias arquitectonicas</h2>
        </div>
        <button type="button" className="text-sm font-bold text-(--primary)">
          Ver mas propiedades
        </button>
      </MotionDiv>

      <div className="grid gap-5 md:grid-cols-12">
        <MotionArticle
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="group relative min-h-105 overflow-hidden rounded-3xl md:col-span-7"
        >
          <img
            src={categories.primary.image}
            alt={categories.primary.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent"></div>
          <div className="absolute bottom-0 p-8 text-white">
            <h3 className="text-3xl font-black">{categories.primary.title}</h3>
            <p className="mt-2 max-w-md text-sm text-white/90">{categories.primary.description}</p>
            <button
              type="button"
              className="mt-5 rounded-full bg-white px-6 py-2 text-sm font-bold text-(--on-surface) transition hover:bg-(--primary) hover:text-(--on-primary)"
            >
              {categories.primary.cta}
            </button>
          </div>
        </MotionArticle>

        <div className="grid gap-5 md:col-span-5 md:grid-rows-2">
          {categories.secondary.map((category, index) => (
            <MotionArticle
              key={category.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
              className="group relative min-h-50 overflow-hidden rounded-3xl"
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent"></div>
              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="text-2xl font-black">{category.title}</h3>
                <p className="mt-1 text-sm text-white/90">{category.description}</p>
              </div>
            </MotionArticle>
          ))}
        </div>
      </div>
    </section>
  )
}

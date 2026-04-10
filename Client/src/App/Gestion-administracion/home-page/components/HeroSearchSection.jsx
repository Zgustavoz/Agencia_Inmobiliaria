import { Search, SlidersHorizontal } from "lucide-react"
import { motion } from "motion/react"

export const HeroSearchSection = ({ hero, searchModes }) => {
  const MotionDiv = motion.div
  const MotionH1 = motion.h1
  const MotionP = motion.p

  return (
    <section className="relative isolate min-h-[74vh] overflow-hidden px-4 pb-14 pt-16 md:px-8 md:pt-24">
      <img
        src={hero.backgroundImage}
        alt="Fondo de propiedades premium"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/50 via-black/20 to-(--surface)"></div>

      <MotionDiv
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mx-auto max-w-5xl text-center"
      >
        <MotionH1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className="font-display text-4xl font-black leading-tight text-white md:text-6xl"
        >
          {hero.title}
        </MotionH1>
        <MotionP
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 }}
          className="mx-auto mt-5 max-w-3xl text-base text-white/90 md:text-lg"
        >
          {hero.subtitle}
        </MotionP>

        <MotionDiv
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
          className="mt-10 rounded-2xl bg-white/80 p-3 shadow-2xl backdrop-blur lg:rounded-full"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-3">
              <Search size={18} className="text-(--outline)" />
              <input
                type="text"
                className="w-full border-none bg-transparent text-sm text-(--on-surface) outline-none"
                placeholder="Zona, barrio o proyecto"
              />
            </label>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {searchModes.map((mode, index) => (
                <motion.button
                  key={mode}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.26 + index * 0.05 }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${index === 0
                    ? "bg-(--primary) text-white hover:bg-(--primary-fixed) hover:text-(--on-primary-fixed)"
                    : "bg-(--surface-container-high) text-(--on-surface-variant) hover:bg-(--surface-container-highest)"
                    }`}
                >
                  {mode}
                </motion.button>
              ))}
            </div>

            <button
              type="button"
              className="mx-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-(--secondary-container) text-(--on-secondary) transition hover:scale-105"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </MotionDiv>
      </MotionDiv>
    </section>
  )
}

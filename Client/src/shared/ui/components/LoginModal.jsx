import { useEffect, useRef } from "react"
import { useLocation } from "react-router"
import { motion } from "motion/react"
import { X } from "lucide-react"
import { useAppForm } from "../../form"
import { LoginCard } from "../../../App/auth/components/LoginCard"
import { useFormLogin } from "../../../App/auth/hook/useFormLogin"
import { useLoginMutation } from "../../../App/auth/hook/useAuthMutation"

export const LoginModal = ({ isOpen, onClose }) => {
  const location = useLocation()
  const previousPathRef = useRef(location.pathname)
  const loginMutation = useLoginMutation({
    onSuccess: () => {
      onClose?.()
    },
  })
  const { defaultValueLogin, loginSquema } = useFormLogin()

  const form = useAppForm({
    defaultValues: defaultValueLogin.defaultValues,
    validators: {
      onChange: loginSquema,
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync({
        username: value.username,
        password: value.password,
      })
    },
  })

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen && previousPathRef.current !== location.pathname) {
      onClose?.()
    }

    previousPathRef.current = location.pathname
  }, [isOpen, location.pathname, onClose])

  if (!isOpen) {
    return null
  }

  const MotionDiv = motion.div

  return (
    <div className="fixed h-dvh inset-0 z-60 flex items-center justify-center p-4">
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />

      <MotionDiv
        initial={{ y: 24, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-1 text-white transition hover:bg-black/70"
          aria-label="Cerrar modal"
        >
          <X size={16} />
        </button>

        <div className="">
          <div className="flex justify-center">
            <LoginCard
              form={form}
              serverError={loginMutation.error?.response?.data?.detail}
              onNavigate={() => onClose?.()}
            />
          </div>

        </div>
      </MotionDiv>
    </div>
  )
}

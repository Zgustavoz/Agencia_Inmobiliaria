import { useEffect, useMemo, useRef, useState } from "react"
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { useFieldContext } from ".."
import { FieldErrors } from "./FieldErrors"

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item.trim())
  }

  if (typeof value === "string" && value.trim()) {
    return [value]
  }

  return []
}

const normalizeCloudinaryUrl = (result, cloudName) => {
  const rawValue =
    result?.foto_Url ??
    result?.foto_url ??
    result?.public_id ??
    result?.url ??
    result?.secure_url ??
    result?.data?.foto_Url ??
    result?.data?.foto_url ??
    result?.data?.public_id ??
    result?.data?.url ??
    result?.data?.secure_url

  if (!rawValue) return null

  if (typeof rawValue === "string" && rawValue.startsWith("http")) {
    return rawValue
  }

  if (!cloudName) return null

  const normalizedId = String(rawValue)
    .replace(/^\/+/, "")
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_400,c_fill/${normalizedId}.webp`
}

export const ImageUploadField = ({
  label = "Imágenes",
  multiple = false,
  maxFiles = 5,
  disabled = false,
  cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  onUpload,
  helperText,
}) => {
  const field = useFieldContext()
  const [pending, setPending] = useState([])
  const [dropError, setDropError] = useState("")
  const currentUrls = useMemo(() => toArray(field.state.value), [field.state.value])
  const currentUrlsRef = useRef(currentUrls)

  useEffect(() => {
    currentUrlsRef.current = currentUrls
  }, [currentUrls])

  useEffect(() => {
    return () => {
      pending.forEach((item) => {
        if (item.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl)
        }
      })
    }
  }, [pending])

  const setFieldValueFromUrls = (urls) => {
    field.handleChange(multiple ? urls : urls[0] ?? "")
  }

  const removeUploaded = (indexToRemove) => {
    const updated = currentUrls.filter((_, index) => index !== indexToRemove)
    setFieldValueFromUrls(updated)
  }

  const onDrop = async (acceptedFiles, fileRejections) => {
    setDropError("")

    if (!onUpload) {
      setDropError("Falta configurar la función onUpload para enviar archivos al backend")
      return
    }

    if (fileRejections.length > 0) {
      setDropError("Solo se permiten imágenes válidas")
    }

    const limit = multiple ? maxFiles : 1
    const currentCount = currentUrlsRef.current.length + pending.length
    const availableSlots = Math.max(limit - currentCount, 0)

    if (availableSlots === 0) {
      setDropError(`Máximo ${limit} imagen${limit > 1 ? "es" : ""}`)
      return
    }

    const filesToUpload = acceptedFiles.slice(0, availableSlots)

    if (acceptedFiles.length > availableSlots) {
      setDropError(`Solo puedes subir ${limit} imagen${limit > 1 ? "es" : ""} como máximo`)
    }

    const pendingEntries = filesToUpload.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      previewUrl: URL.createObjectURL(file),
      file,
      name: file.name,
    }))

    setPending((prev) => [...prev, ...pendingEntries])

    for (const entry of pendingEntries) {
      try {
        const result = await onUpload(entry.file)
        const normalizedUrl = normalizeCloudinaryUrl(result, cloudName)

        if (!normalizedUrl) {
          throw new Error("No se pudo obtener la URL de Cloudinary")
        }

        const updatedUrls = [...currentUrlsRef.current, normalizedUrl]
        currentUrlsRef.current = updatedUrls
        setFieldValueFromUrls(updatedUrls)
      } catch (error) {
        const errorMessage =
          error?.response?.data?.detail ??
          error?.response?.data?.error ??
          error?.message ??
          "Error al subir la imagen"
        setDropError(errorMessage)
      } finally {
        setPending((prev) => prev.filter((item) => item.id !== entry.id))
        if (entry.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(entry.previewUrl)
        }
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    accept: {
      "image/*": [],
    },
  })

  return (
    <div>
      <label htmlFor={field.name} className="mb-1 block text-sm font-semibold text-(--on-surface-variant)">
        {label}
      </label>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-5 transition-all duration-200 ${isDragActive
            ? "border-(--primary) bg-(--primary-fixed)/40"
            : "border-(--outline-variant) bg-(--surface-container-lowest)"
          } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
      >
        <input id={field.name} {...getInputProps()} />

        <div className="flex items-center gap-3 text-(--on-surface-variant)">
          {isDragActive ? <UploadCloud size={20} /> : <ImagePlus size={20} />}
          <div className="text-sm">
            <p className="font-semibold">
              {isDragActive ? "Suelta las imágenes aquí" : "Arrastra imágenes o haz click para seleccionar"}
            </p>
            <p className="text-xs opacity-80">
              {multiple ? `Hasta ${maxFiles} imágenes` : "Solo 1 imagen"}
            </p>
          </div>
        </div>
      </div>

      {helperText ? <p className="mt-2 text-xs text-(--on-surface-variant)">{helperText}</p> : null}

      {dropError ? <p className="mt-2 text-sm font-medium text-red-500">{dropError}</p> : null}

      {(currentUrls.length > 0 || pending.length > 0) && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {currentUrls.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-lg border border-(--outline-variant)">
              <img src={url} alt={`preview-${index}`} className="h-28 w-full object-cover" />
              <button
                type="button"
                onClick={() => removeUploaded(index)}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Eliminar imagen"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {pending.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-lg border border-(--outline-variant)">
              <img src={item.previewUrl} alt={item.name} className="h-28 w-full object-cover opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                <Loader2 size={20} className="animate-spin" />
              </div>
            </div>
          ))}
        </div>
      )}

      <FieldErrors meta={field.state.meta} />
    </div>
  )
}

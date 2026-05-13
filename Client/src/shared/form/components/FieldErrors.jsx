
export const FieldErrors = ({ meta }) => {
  if (!meta.isTouched || !meta.errors?.length) return null

  return meta.errors.map((error, index) => (
    <p key={index} className="text-red-500 text-sm font-medium">
      {error?.message ?? String(error)}
    </p>
  ))
}

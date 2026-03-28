import { useFieldContext } from ".."
import { FieldErrors } from "./FieldErrors"

export const SelectField = ({
  label,
  options = [],
  placeholder = "Selecciona una opción",
  disabled = false,
}) => {
  const field = useFieldContext()

  return (
    <div>
      <label
        htmlFor={field.name}
        className="mb-1 block text-sm font-semibold text-(--on-surface-variant)"
      >
        {label}
      </label>
      <select
        id={field.name}
        value={field.state.value ?? ""}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        disabled={disabled}
        className="w-full rounded-lg border border-(--outline-variant) bg-(--surface-container-lowest) px-3 py-3 text-sm text-(--on-surface) outline-none transition-all duration-200 focus:border-(--primary) focus:ring-2 focus:ring-(--primary-fixed) disabled:cursor-not-allowed disabled:opacity-70"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}

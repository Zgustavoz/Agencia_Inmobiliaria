import { useFieldContext } from ".."
import { FieldErrors } from "./FieldErrors"

export const CheckboxField = ({
  label,
  description,
  disabled = false,
}) => {
  const field = useFieldContext()

  return (
    <div>
      <label className="flex items-start gap-3">
        <input
          id={field.name}
          type="checkbox"
          checked={Boolean(field.state.value)}
          onChange={(e) => field.handleChange(e.target.checked)}
          onBlur={field.handleBlur}
          disabled={disabled}
          className="mt-0.5 h-4 w-4 rounded border-(--outline-variant) text-(--primary) focus:ring-(--primary-fixed) disabled:cursor-not-allowed"
        />
        <span className="text-xs leading-relaxed text-(--on-surface-variant)">
          {label}
          {description ? (
            <span className="mt-1 block text-[10px] opacity-70">{description}</span>
          ) : null}
        </span>
      </label>
      <FieldErrors meta={field.state.meta} />
    </div>
  )
}

import { useFieldContext } from ".."
import { FieldErrors } from "./FieldErrors"

export const TextField = ({
  label,
  type = 'text',
  icon: Icon,
  placeholder = '',
  autoComplete,
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
      <div className="group relative flex items-center">
        {Icon ? (
          <div className="absolute left-3 transition-colors duration-200 
              text-(--outline) group-focus-within:text-(--primary)">
            <Icon size={20} />
          </div>
        ) : null}

        <input
          type={type}
          id={field.name}
          value={field.state.value ?? ''}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`w-full rounded-lg border border-(--outline-variant) bg-(--surface-container-lowest) py-3 pr-3 
            text-sm text-(--on-surface) outline-none transition-all duration-200 
            placeholder:text-(--outline) focus:border-(--primary) focus:ring-2 focus:ring-(--primary-fixed) 
            disabled:cursor-not-allowed disabled:opacity-70 ${Icon ? 'pl-10' : 'pl-3'}`}
        />
      </div>
      <FieldErrors
        meta={field.state.meta}
      />
    </div>
  )
}

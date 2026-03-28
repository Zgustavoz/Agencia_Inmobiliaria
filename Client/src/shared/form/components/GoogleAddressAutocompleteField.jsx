import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { useFieldContext } from ".."
import { FieldErrors } from "./FieldErrors"

export const GoogleAddressAutocompleteField = ({
  label = "Dirección",
  placeholder = "Escribe una dirección",
  country = "bo",
  disabled = false,
  onPlaceSelected,
}) => {
  const field = useFieldContext()
  const places = useMapsLibrary("places")

  const legacyInputRef = useRef(null)
  const newAutocompleteContainerRef = useRef(null)
  const legacyListenerRef = useRef(null)
  const newSelectHandlerRef = useRef(null)
  const newInputHandlerRef = useRef(null)
  const newAutocompleteElementRef = useRef(null)

  const onPlaceSelectedRef = useRef(onPlaceSelected)
  const handleChangeRef = useRef(field.handleChange)
  const [legacyAutocomplete, setLegacyAutocomplete] = useState(null)

  const mode = !places
    ? "loading"
    : places.PlaceAutocompleteElement
      ? "new"
      : places.Autocomplete
        ? "legacy"
        : "manual"

  useEffect(() => {
    onPlaceSelectedRef.current = onPlaceSelected
    handleChangeRef.current = field.handleChange
  }, [onPlaceSelected, field.handleChange])

  useEffect(() => {
    if (mode !== "new" || !places || !newAutocompleteContainerRef.current || newAutocompleteElementRef.current) {
      return
    }

    const currentContainer = newAutocompleteContainerRef.current

    const element = new places.PlaceAutocompleteElement()
    element.placeholder = placeholder
    if (country) {
      element.includedRegionCodes = [country]
    }
    element.style.width = "100%"

    if (disabled) {
      element.setAttribute("disabled", "true")
    } else {
      element.removeAttribute("disabled")
    }

    const onSelect = async (event) => {
      const placePrediction = event?.placePrediction ?? event?.detail?.placePrediction
      if (!placePrediction?.toPlace) return

      const place = placePrediction.toPlace()
      await place.fetchFields({
        fields: ["formattedAddress", "displayName", "location", "id"],
      })

      const normalizedAddress = place?.formattedAddress ?? place?.displayName ?? ""
      if (normalizedAddress) {
        handleChangeRef.current(normalizedAddress)
      }

      if (onPlaceSelectedRef.current) {
        onPlaceSelectedRef.current(place)
      }
    }

    const onInput = (event) => {
      const typedValue = event?.target?.value ?? ""
      handleChangeRef.current(typedValue)
    }

    newSelectHandlerRef.current = onSelect
    newInputHandlerRef.current = onInput

    element.addEventListener("gmp-select", onSelect)
    element.addEventListener("input", onInput)

    currentContainer.appendChild(element)
    newAutocompleteElementRef.current = element

    return () => {
      if (newAutocompleteElementRef.current && newSelectHandlerRef.current) {
        newAutocompleteElementRef.current.removeEventListener("gmp-select", newSelectHandlerRef.current)
      }
      if (newAutocompleteElementRef.current && newInputHandlerRef.current) {
        newAutocompleteElementRef.current.removeEventListener("input", newInputHandlerRef.current)
      }
      if (newAutocompleteElementRef.current && currentContainer.contains(newAutocompleteElementRef.current)) {
        currentContainer.removeChild(newAutocompleteElementRef.current)
      }

      newAutocompleteElementRef.current = null
      newSelectHandlerRef.current = null
      newInputHandlerRef.current = null
    }
  }, [mode, places, placeholder, country, disabled])

  useEffect(() => {
    if (mode !== "legacy" || !places || !legacyInputRef.current || legacyAutocomplete) return

    const options = {
      fields: [
        "formatted_address",
        "name",
        "place_id",
        "geometry",
        "address_components",
      ],
      componentRestrictions: country ? { country } : undefined,
    }

    setLegacyAutocomplete(new places.Autocomplete(legacyInputRef.current, options))
  }, [mode, places, legacyAutocomplete, country])

  useEffect(() => {
    if (mode !== "legacy" || !legacyAutocomplete) return

    legacyListenerRef.current = legacyAutocomplete.addListener("place_changed", () => {
      const place = legacyAutocomplete.getPlace()
      const normalizedAddress = place?.formatted_address ?? place?.name ?? ""

      if (normalizedAddress) {
        handleChangeRef.current(normalizedAddress)
      }

      if (onPlaceSelectedRef.current) {
        onPlaceSelectedRef.current(place)
      }
    })

    return () => {
      if (legacyListenerRef.current) {
        legacyListenerRef.current.remove()
        legacyListenerRef.current = null
      }
    }
  }, [mode, legacyAutocomplete])

  return (
    <div>
      <label htmlFor={field.name} className="mb-1 block text-sm font-semibold text-(--on-surface-variant)">
        {label}
      </label>

      <div className="group relative flex items-center">
        <div className="absolute left-3 text-(--outline) transition-colors duration-200 group-focus-within:text-(--primary)">
          <MapPin size={20} />
        </div>

        {mode === "new" ? (
          <div
            id={field.name}
            ref={newAutocompleteContainerRef}
            className="w-full rounded-lg border border-(--outline-variant) bg-(--surface-container-lowest) py-2 pr-3 pl-10 text-sm text-(--on-surface) outline-none transition-all duration-200 focus-within:border-(--primary) focus-within:ring-2 focus-within:ring-(--primary-fixed)"
          />
        ) : (
          <input
            ref={legacyInputRef}
            id={field.name}
            type="text"
            value={field.state.value ?? ""}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder={placeholder}
            autoComplete="street-address"
            disabled={disabled}
            className="w-full rounded-lg border border-(--outline-variant) bg-(--surface-container-lowest) py-3 pr-3 pl-10 text-sm text-(--on-surface) outline-none transition-all duration-200 placeholder:text-(--outline) focus:border-(--primary) focus:ring-2 focus:ring-(--primary-fixed) disabled:cursor-not-allowed disabled:opacity-70"
          />
        )}
      </div>

      <FieldErrors meta={field.state.meta} />
    </div>
  )
}

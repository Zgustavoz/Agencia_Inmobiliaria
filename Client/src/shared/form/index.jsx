import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./components/TextField";
import { BotonSubmitField } from "./components/BotonSubmitField";
import { SelectField } from "./components/SelectField";
import { CheckboxField } from "./components/CheckboxField";
import { GoogleAddressAutocompleteField } from "./components/GoogleAddressAutocompleteField";
import { ImageUploadField } from "./components/ImageUploadField";

export const {
  fieldContext,
  useFieldContext,
  useFormContext,
  formContext } = createFormHookContexts()

export const {
  useAppForm
} = createFormHook({
  fieldComponents: {
    // componentes para los formularios.
    TextField,
    SelectField,
    CheckboxField,
    GoogleAddressAutocompleteField,
    ImageUploadField,
  },
  formComponents: {
    // botones para confirmar la información que esta en el form
    BotonSubmitField
  },
  fieldContext,
  formContext
})


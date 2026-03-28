import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./components/TextField";
import { BotonSubmitField } from "./components/BotonSubmitField";
import { SelectField } from "./components/SelectField";
import { CheckboxField } from "./components/CheckboxField";
import { GoogleAddressAutocompleteField } from "./components/GoogleAddressAutocompleteField";

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
  },
  formComponents: {
    // botones para confirmar la información que esta en el form
    BotonSubmitField
  },
  fieldContext,
  formContext
})


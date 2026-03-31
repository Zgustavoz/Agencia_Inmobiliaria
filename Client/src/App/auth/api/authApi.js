import { intanciaAxios } from "../../../config/axios"

export const loginRequest = async ({ username, password }) => {
  const { data } = await intanciaAxios.post(
    "/gestion_usuarios/auth/login/",
    { username, password }
  )

  return data
}

export const registerRequest = async ({
  username,
  email,
  nombres,
  apellidos,
  telefono,
  password,
  password2,
}) => {
  const { data } = await intanciaAxios.post(
    "/gestion_usuarios/auth/registro/",
    {
      username,
      email,
      nombres,
      apellidos,
      telefono,
      password,
      password2,
    }
  )

  return data
}

export const registerProfesionalRequest = async (data) => {
  const { data: responseData } = await intanciaAxios.post(
    "/gestion_usuarios/auth/registro-agente/",
    {
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      username: data.username,
      password_hash: data.password,
      foto_url: data.fotoUrl,
      role: data.role,
    }
  )

  return responseData
}

export const uploadAuthImageRequest = async (file, folder = "users/profiles") => {
  const formData = new FormData()
  formData.append("imagen", file)
  formData.append("folder", folder)

  const { data } = await intanciaAxios.post("/gestion_usuarios/upload-image/", formData)
  return data
}

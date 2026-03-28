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

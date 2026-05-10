import { intanciaAxios } from "../../../config/axios"

export const getCountNotificaciones = () =>
  intanciaAxios.get("/api/notificaciones/count/").then(r => r.data)

export const getNotificaciones = (soloNoLeidas = false) =>
  intanciaAxios
    .get(`/api/notificaciones/${soloNoLeidas ? '?no_leidas=true' : ''}`)
    .then(r => r.data)

export const marcarLeida = (id) =>
  intanciaAxios.patch(`/api/notificaciones/${id}/marcar-leida/`).then(r => r.data)

export const marcarTodasLeidas = () =>
  intanciaAxios.post("/api/notificaciones/marcar-todas-leidas/").then(r => r.data)

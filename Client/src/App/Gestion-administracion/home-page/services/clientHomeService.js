import { clientHomeMock } from "../mock/clientHomeMock"

export const getClientHomeData = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 350)
  })

  return clientHomeMock
}

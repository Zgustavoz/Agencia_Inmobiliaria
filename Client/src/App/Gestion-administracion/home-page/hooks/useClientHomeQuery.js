import { useQuery } from "@tanstack/react-query"
import { getClientHomeData } from "../services/clientHomeService"

export const CLIENT_HOME_QUERY_KEY = ["client-home-page"]

export const useClientHomeQuery = () => {
  return useQuery({
    queryKey: CLIENT_HOME_QUERY_KEY,
    queryFn: getClientHomeData,
    staleTime: 1000 * 60 * 10,
  })
}

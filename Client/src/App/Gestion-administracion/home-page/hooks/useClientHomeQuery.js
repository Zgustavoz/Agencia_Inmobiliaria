import { useQuery } from "@tanstack/react-query"
import { getClientHomeData } from "../services/clientHomeService"

export const useClientHomeQuery = (filters = {}) => {
  return useQuery({
    queryKey: ["client-home-page", filters],
    queryFn: () => getClientHomeData(filters),
    staleTime: 1000 * 60 * 10,
  })
}

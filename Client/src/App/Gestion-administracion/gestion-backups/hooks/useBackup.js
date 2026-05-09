import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { listarBackups, crearBackup, restaurarBackup } from "../api/backupApi";

export const useBackup = () => {
  const queryClient = useQueryClient();

  const backups = useQuery({
    queryKey: ["backups"],
    queryFn: listarBackups,
  });

  const crear = useMutation({
    mutationFn: crearBackup,
    onSuccess: () => {
      queryClient.invalidateQueries(["backups"]);
      toast.success("Respaldo generado exitosamente");
    },
    onError: () => toast.error("Error al generar el respaldo"),
  });

  // En useBackup.js dentro de restaurar useMutation:
  const restaurar = useMutation({
    mutationFn: restaurarBackup,
    onMutate: () => {
      // Retornamos el ID para poder cerrarlo o actualizarlo luego
      return toast.loading(
        "Restaurando base de datos... no cierres la ventana",
      );
    },
    onSuccess: (data, variables, context) => {
      toast.dismiss(context); // Cerramos el loading
      toast.success("Sistema restaurado con éxito");
      setTimeout(() => window.location.reload(), 1500);
    },
    onError: (error, variables, context) => {
      toast.dismiss(context);
      toast.error(error?.response?.data?.error || "Error en la restauración");
    },
  });

  return { backups, crear, restaurar };
};

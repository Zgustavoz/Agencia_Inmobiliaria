import { Database } from "lucide-react";
import { useBackup } from "../hooks/useBackup";
import { useAuth } from "../../../auth/context/AuthContext";
import { BackupTable } from "../components/BackupTable";
import { CreateButton } from "../../../../shared/ui/components/buttons";

export const BackupsPage = () => {
  const { tienePermiso } = useAuth();
  const { backups, crear, restaurar } = useBackup();

  const puedeCrearBackup = tienePermiso("backups", "crear");
  const puedeRestaurarBackup = tienePermiso("backups", "restaurar");

  const handleRestaurar = (filename) => {
    if (!puedeRestaurarBackup) return;

    if (
      window.confirm(
        `¿Seguro que deseas restaurar el archivo ${filename}? Los datos actuales se perderán.`,
      )
    ) {
      restaurar.mutate(filename);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-(--on-surface) flex items-center gap-2">
            <Database className="w-6 h-6" />
            Respaldos de Base de Datos
          </h1>
          <p className="text-sm text-(--on-surface-variant) mt-1">
            {backups.data?.length || 0} archivos encontrados
          </p>
        </div>
        <CreateButton
          onClick={() => crear.mutate()}
          disabled={!puedeCrearBackup || crear.isPending}
        >
          {crear.isPending ? "Generando..." : "Generar Backup"}
        </CreateButton>
      </div>

      {/* Tabla */}
      {backups.isLoading ? (
        <div className="text-center py-12 text-(--on-surface-variant)">
          Cargando lista...
        </div>
      ) : (
        <BackupTable
          backups={backups.data}
          onRestaurar={handleRestaurar}
          canRestore={puedeRestaurarBackup}
          isRestoring={restaurar.isPending}
        />
      )}
    </div>
  );
};

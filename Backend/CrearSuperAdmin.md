 1. Preparar los Roles y Permisos
  Primero deben crear el rol "Superadmin" y los permisos globales en su base de datos local:

   1 python manage.py setup_superadmin
  (Este comando crea el Rol de Superadmin y le asigna los permisos de gestionar tenants y estadísticas globales).

  2. Crear su Usuario Administrador Global
  Luego, deben crear su propio usuario para poder loguearse. El script es inteligente: si ya existe el usuario, lo actualiza con los permisos correctos:

   1 python manage.py create_global_superadmin --username admin_global --password admin123
  (Pueden cambiar el username y password por los que ellos prefieran).

  ---

  Resumen para tus compañeros:
  Diles que una vez ejecutados esos dos comandos, deben:
   1. Ir al Login normal del sistema.
   2. Ingresar las credenciales que crearon (ej: admin_global / admin123).
   3. El sistema los enviará automáticamente al nuevo Panel Global en lugar de al dashboard de una inmobiliaria.

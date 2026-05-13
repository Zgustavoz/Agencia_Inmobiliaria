from django.db import migrations


class Migration(migrations.Migration):
    """Merge migration for modulo_administracion_configuracion.

    This migration resolves two independent branches (0002_backupcloud and
    0003_tenant) by declaring a merge dependency and no operations.
    """

    dependencies = [
        ("modulo_administracion_configuracion", "0002_backupcloud"),
        ("modulo_administracion_configuracion", "0003_tenant"),
    ]

    operations = []

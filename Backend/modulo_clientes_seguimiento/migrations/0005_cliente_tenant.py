# Generated migration for Cliente tenant field
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('modulo_clientes_seguimiento', '0004_cliente_usuario'),
        ('modulo_administracion_configuracion', '0003_tenant'),
    ]

    operations = [
        migrations.AddField(
            model_name='cliente',
            name='tenant',
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE, 
                related_name='clientes', 
                to='modulo_administracion_configuracion.tenant'
            ),
            preserve_default=False,
        ),
    ]

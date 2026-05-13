# Generated migration for Usuario tenant field
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gestion_usuarios', '0003_merge_20260330_1629'),
        ('modulo_administracion_configuracion', '0003_tenant'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='tenant',
            field=models.ForeignKey(
                blank=True, 
                null=True, 
                on_delete=django.db.models.deletion.SET_NULL, 
                related_name='usuarios', 
                to='modulo_administracion_configuracion.tenant'
            ),
        ),
    ]

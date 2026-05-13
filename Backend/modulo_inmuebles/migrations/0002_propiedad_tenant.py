# Generated migration for Propiedad tenant field
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('modulo_inmuebles', '0001_initial'),
        ('modulo_administracion_configuracion', '0003_tenant'),
    ]

    operations = [
        migrations.AddField(
            model_name='propiedad',
            name='tenant',
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE, 
                related_name='propiedades', 
                to='modulo_administracion_configuracion.tenant'
            ),
            preserve_default=False,
        ),
    ]

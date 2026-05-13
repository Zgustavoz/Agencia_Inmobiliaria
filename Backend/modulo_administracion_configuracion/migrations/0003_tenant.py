# Generated migration for Tenant model
from django.db import migrations, models
from django.utils import timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tenant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255, unique=True)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('estado', models.BooleanField(default=True, help_text='¿El tenant está activo?')),
                ('fecha_vencimiento_pago', models.DateField(default=timezone.now, help_text='Fecha en la que vence el período de pago actual')),
                ('plan', models.CharField(choices=[('basico', 'Básico'), ('profesional', 'Profesional'), ('empresa', 'Empresa')], default='basico', max_length=20)),
                ('max_propiedades', models.IntegerField(default=3, help_text='Máximo número de propiedades permitidas en este plan')),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('actualizado_en', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Tenant',
                'verbose_name_plural': 'Tenants',
                'db_table': 'tenants',
            },
        ),
        migrations.AddIndex(
            model_name='tenant',
            index=models.Index(fields=['estado'], name='tenants_estado_idx'),
        ),
        migrations.AddIndex(
            model_name='tenant',
            index=models.Index(fields=['plan'], name='tenants_plan_idx'),
        ),
    ]

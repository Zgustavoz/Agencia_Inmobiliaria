# Generated manually for contract payment checkout support.

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('modulo_contratos', '0003_operacioninmobiliaria_id_cotizacion_and_more'),
        ('modulo_pagos', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pago',
            name='pago_contrato',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='pagos_stripe',
                to='modulo_contratos.pagocontrato',
            ),
        ),
    ]

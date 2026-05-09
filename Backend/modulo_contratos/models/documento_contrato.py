from django.db import models
from .contrato import Contrato


class DocumentoContrato(models.Model):

    id_documento = models.BigAutoField(primary_key=True)

    contrato = models.ForeignKey(
        Contrato,
        on_delete=models.CASCADE,
        related_name='documentos'
    )

    nombre = models.CharField(max_length=255)
    archivo_url = models.TextField()

    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'documentos_contrato'
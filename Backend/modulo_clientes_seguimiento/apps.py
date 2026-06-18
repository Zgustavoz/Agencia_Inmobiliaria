from django.apps import AppConfig


class ModuloClientesSeguimientoConfig(AppConfig):
    name = 'modulo_clientes_seguimiento'

    def ready(self):
        import modulo_clientes_seguimiento.signals

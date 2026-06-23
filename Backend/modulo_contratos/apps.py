from django.apps import AppConfig


class ModuloContratosConfig(AppConfig):
    name = 'modulo_contratos'

    def ready(self):
        import modulo_contratos.signals

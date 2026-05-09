from rest_framework.routers import DefaultRouter
from .views import (
    ContratoViewSet,
    PagoContratoViewSet,
    DocumentoContratoViewSet
)

router = DefaultRouter()

router.register(r'contratos', ContratoViewSet, basename='contrato')
router.register(r'pagos', PagoContratoViewSet, basename='pago-contrato')
router.register(r'documentos', DocumentoContratoViewSet, basename='documento-contrato')

urlpatterns = router.urls
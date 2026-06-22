from django.urls import path, re_path
from .views import (
    ContratoCriteriosPagoView,
    CreateCheckoutSessionView,
    CreateContratoCheckoutSessionView,
    ConfirmarPagoContratoView,
    stripe_webhook,
)

urlpatterns = [
    # Acepta checkout/ y checkout (con o sin slash)
    re_path(r'^checkout/?$', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('contratos/<int:id_contrato>/criterios/', ContratoCriteriosPagoView.as_view(), name='contrato-criterios-pago'),
    path('contratos/<int:id_pago>/checkout/', CreateContratoCheckoutSessionView.as_view(), name='contrato-checkout-session'),
    path('contratos/<int:id_pago>/confirmar/', ConfirmarPagoContratoView.as_view(), name='contrato-confirmar-pago'),
    re_path(r'^webhook/?$', stripe_webhook, name='stripe-webhook'),
]

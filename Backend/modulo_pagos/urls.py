from django.urls import path, re_path
from .views import CreateCheckoutSessionView, stripe_webhook

urlpatterns = [
    # Acepta checkout/ y checkout (con o sin slash)
    re_path(r'^checkout/?$', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    re_path(r'^webhook/?$', stripe_webhook, name='stripe-webhook'),
]

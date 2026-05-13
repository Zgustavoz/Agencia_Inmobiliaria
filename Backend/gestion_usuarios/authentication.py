# pylint: disable=C0114,C0115,C0116
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        access_token = request.COOKIES.get(settings.SIMPLE_JWT.get('AUTH_COOKIE'))

        if not access_token:
            return None

        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            
            # ✓ Resolver y validar tenant desde token (paso 4 del plan)
            self._attach_tenant_to_request(request, validated_token, user)
            
            return (user, validated_token)
        except TokenError as e:
            raise InvalidToken(e.args[0]) from e
        except Exception as e:
            raise AuthenticationFailed(str(e)) from e
    
    def _attach_tenant_to_request(self, request, validated_token, user):
        """
        Resuelve el tenant_id desde múltiples fuentes (JWT, cabecera, sesión)
        y lo valida contra el usuario autenticado.
        
        Disponibiliza request.tenant_id y request.tenant para su uso en vistas.
        """
        tenant_id_from_token = validated_token.get('tenant_id')
        tenant_id_from_header = request.META.get('HTTP_X_TENANT_ID')
        tenant_id = None
        
        # Prioridad: 1) Header, 2) Token, 3) Usuario
        if tenant_id_from_header:
            tenant_id = int(tenant_id_from_header)
        elif tenant_id_from_token:
            tenant_id = tenant_id_from_token
        elif user.tenant:
            tenant_id = user.tenant.id
        
        # Validar que el tenant_id coincida con el usuario
        if tenant_id and user.tenant and user.tenant.id != tenant_id:
            raise AuthenticationFailed(
                f"Tenant ID {tenant_id} no coincide con el tenant del usuario autenticado."
            )
        
        # Cargar el objeto Tenant si existe el ID
        request.tenant_id = tenant_id
        if tenant_id:
            try:
                from modulo_administracion_configuracion.models import Tenant
                request.tenant = Tenant.objects.get(id=tenant_id)
            except Tenant.DoesNotExist:
                raise AuthenticationFailed(f"Tenant ID {tenant_id} no existe.")
        else:
            request.tenant = None

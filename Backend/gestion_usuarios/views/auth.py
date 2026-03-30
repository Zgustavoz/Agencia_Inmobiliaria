# pylint: disable=C0114,C0115,C0116,no-member,W0718
import traceback
import threading
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils import timezone
from ..serializers import CustomTokenObtainPairSerializer, RegistroSerializer, UsuarioSerializer
from ..models import Usuario
from rest_framework import generics, permissions

from ..services.bitacora import BitacoraService  #JOSe agrego esto para la bitacora

def set_auth_cookies(response, access_token, refresh_token=None):
    access_lifetime  = int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
    refresh_lifetime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
    cookie_secure    = settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False)
    cookie_samesite  = settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax')
    response.set_cookie(
        key='access_token', value=access_token,
        httponly=True, secure=cookie_secure,
        samesite=cookie_samesite, max_age=access_lifetime,
    )
    if refresh_token:
        response.set_cookie(
            key='refresh_token', value=refresh_token,
            httponly=True, secure=cookie_secure,
            samesite=cookie_samesite, max_age=refresh_lifetime,
        )


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0]) from e

        access_token  = serializer.validated_data['access']
        refresh_token = serializer.validated_data['refresh']

        user               = serializer.user
        user.ultimo_acceso = timezone.now()
        user.es_online     = True
        user.save(update_fields=['ultimo_acceso', 'es_online'])

        # --- BITÁCORA LOGIN ---
        BitacoraService.registrar(
            request=request,
            modulo='Seguridad',
            entidad='Usuario',
            id_entidad=user.id,
            accion='LOGIN',
            detalle=f"El usuario {user.username} inició sesión correctamente.",
            user=user  # <--- ¡ESTO ES LO QUE SOLUCIONA EL NULL!
        )
        response = Response({'message': 'Login exitoso'}, status=status.HTTP_200_OK)
        set_auth_cookies(response, access_token, refresh_token)
        return response


class RegistroView(generics.CreateAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # --- BITÁCORA LOGIN ---
        BitacoraService.registrar(
            request=request,
            modulo='Seguridad',
            entidad='Usuario',
            id_entidad=user.id,
            accion='REGISTRO',
            detalle=f"Nuevo usuario registrado: {user.username} ({user.email})",
            user=user
        )

        return Response({
            'message': 'Usuario registrado exitosamente',
            'user': {
                'id':        user.id,
                'username':  user.username,
                'email':     user.email,
                'nombres':   user.nombres,
                'apellidos': user.apellidos,
            }
        }, status=status.HTTP_201_CREATED)


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response(
                {'error': 'No hay sesión activa'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            refresh      = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            response     = Response({'message': 'Token renovado'}, status=status.HTTP_200_OK)
            set_auth_cookies(response, access_token)
            return response
        except TokenError:
            return Response(
                {'error': 'Sesión expirada, inicia sesión nuevamente'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if request.user and request.user.is_authenticated:

            # Guardamos datos antes de cerrar
            user_id = request.user.id
            username = request.user.username
            
            request.user.es_online = False
            request.user.save(update_fields=['es_online'])

        # --- BITÁCORA LOGOUT ---
            BitacoraService.registrar(
                request=request,
                modulo='Seguridad',
                entidad='Usuario',
                id_entidad=user_id,
                accion='LOGOUT',
                detalle=f"El usuario {username} cerró sesión."
            )
        
        response = Response({'message': 'Sesión cerrada'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'El email es requerido'}, status=400)

        def send_reset_email(user, email):
            try:
                token     = default_token_generator.make_token(user)
                uid       = urlsafe_base64_encode(force_bytes(user.pk))
                reset_url = f"{settings.FRONTEND_URL}/restablecer-password/{uid}/{token}/"
                send_mail(
                    'Recuperación de Contraseña',
                    f'Enlace para restablecer tu contraseña: {reset_url}',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
            except Exception:
                traceback.print_exc()

        try:
            user   = Usuario.objects.get(email=email)
            thread = threading.Thread(target=send_reset_email, args=(user, email))
            thread.daemon = False
            thread.start()
            return Response({'message': 'Email enviado'}, status=200)
        except Usuario.DoesNotExist:
            return Response({'message': 'Email enviado'}, status=200)
        except Exception:
            traceback.print_exc()
            return Response({'error': 'Error interno'}, status=500)


class RestablecerPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid  = urlsafe_base64_decode(uidb64).decode()
            user = Usuario.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response(
                {'error': 'El enlace no es válido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {'error': 'El enlace ha expirado o ya fue utilizado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_password = request.data.get('new_password')
        if not new_password:
            return Response(
                {'error': 'Debes proporcionar una nueva contraseña'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(new_password) < 8:
            return Response(
                {'error': 'La contraseña debe tener al menos 8 caracteres'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Contraseña restablecida exitosamente'})
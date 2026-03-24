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
            return (user, validated_token)
        except TokenError as e:
            raise InvalidToken(e.args[0]) from e
        except Exception as e:
            raise AuthenticationFailed(str(e)) from e
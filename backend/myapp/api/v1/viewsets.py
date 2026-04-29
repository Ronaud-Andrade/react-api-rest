from django.conf import settings
from myapp.models import Gallery, Product
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

from .serializers import CookieTokenRefreshSerializer, GallerySerializer, ProductSerializer


# ViewSet para o model Product, já existente na API.
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


# ViewSet para a nova entidade Gallery.
# O ModelViewSet oferece automaticamente as ações CRUD:
# list, retrieve, create, update, partial_update e destroy.
class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all().order_by('-created_at')
    serializer_class = GallerySerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            # Configura o cookie httpOnly
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=settings.SECURE_COOKIE,
                samesite="Lax",  # ou 'Strict' conforme necessidade
                max_age=3600,
                path="/"
            )

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=settings.SECURE_COOKIE, 
                samesite="Lax",
                max_age=30 * 24 * 60 * 60,  # 30 dias
            )
        return response


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

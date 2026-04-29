from myapp.models import Gallery, Product
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


# Serializador para o modelo Product existente.
# Ele converte instâncias de Product para JSON e vice-versa.
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


# Serializador para o novo modelo Gallery.
# Vai permitir criar, listar, atualizar e deletar galerias via API.
class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'


# Serializador customizado de refresh token que lê o token de refresh
# a partir do cookie em vez de apenas do corpo da requisição.
class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        if not attrs.get("refresh"):
            attrs["refresh"] = self.context["request"].COOKIES.get("refresh_token")
        return super().validate(attrs)
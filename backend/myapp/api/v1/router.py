from rest_framework.routers import DefaultRouter

from .viewsets import GalleryViewSet, ProductViewSet

# Roteador padrão do Django REST Framework.
# Ele cria rotas para list, retrieve, create, update, partial_update e destroy.
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'galleries', GalleryViewSet)

# As URLs geradas pelo roteador ficam disponíveis diretamente como urlpatterns.
urlpatterns = router.urls

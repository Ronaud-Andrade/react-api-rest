from django.core.validators import URLValidator
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.TextField(validators=[URLValidator()])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Gallery(models.Model):
    # Título da imagem da galeria
    title = models.CharField(max_length=255)
    # Descrição opcional da imagem
    description = models.TextField(blank=True)
    # URL da imagem armazenada externamente ou em um provedor de arquivos
    image_url = models.TextField(validators=[URLValidator()])
    # Data de criação do registro
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Gallery"
        verbose_name_plural = "Galleries"

    def __str__(self):
        return self.title
from django.contrib import admin

from .models import Gallery, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "created_at",)
    search_fields = ("name", "price", "created_at",)
    list_filter = ("name", "price", "created_at",)


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at",)
    search_fields = ("title", "description",)
    list_filter = ("created_at",)

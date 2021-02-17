from django.contrib import admin
from polymorphic.admin import PolymorphicParentModelAdmin, PolymorphicChildModelAdmin
from polymorphic.admin.filters import PolymorphicChildModelFilter

from . import models

admin.site.register(models.Account)
admin.site.register(models.AccountCurrentValue)
# admin.site.register(models.Category)
# admin.site.register(models.SubCategory)
admin.site.register(models.Transaction)

# @admin.register(models.Category)
class CategoryBaseAdmin(PolymorphicChildModelAdmin):
    base_model = models.Category

@admin.register(models.SubCategory)
class SubCategoryAdmin(CategoryBaseAdmin):
    base_model = models.SubCategory
    show_in_index = True

@admin.register(models.Category)
class CategoryAdmin(PolymorphicParentModelAdmin):
    base_model = models.Category
    child_models = (models.Category, models.SubCategory,)
    # list_filter = (PolymorphicChildModelFilter,)
    polymorphic_list = True

    def get_queryset(self, request):
        # optimize the list display.
        return super().get_queryset(request).not_instance_of(models.SubCategory)

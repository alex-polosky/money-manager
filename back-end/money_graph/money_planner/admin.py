from django.contrib import admin

from . import models

admin.site.register(models.Account)
admin.site.register(models.Income)
admin.site.register(models.Transfer)
admin.site.register(models.Expense)
admin.site.register(models.Template)
admin.site.register(models.TemplateAccount)
admin.site.register(models.TemplateIncome)
admin.site.register(models.TemplateTransfer)
admin.site.register(models.TemplateExpense)
admin.site.register(models.Instance)
admin.site.register(models.InstanceAccount)
admin.site.register(models.InstanceIncome)
admin.site.register(models.InstanceTransfer)
admin.site.register(models.InstanceExpense)

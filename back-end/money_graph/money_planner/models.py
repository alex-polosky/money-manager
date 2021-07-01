import datetime
import uuid
from django.db import models

class _base_uuid_model(models.Model):
    class Meta:
        abstract = True

    id: uuid.UUID = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    origin_key: str = models.TextField(null=True)

#############################################################################################
# Base models needed to operate

class Account(_base_uuid_model):
    name_friendly: str = models.CharField(max_length=200, help_text='A friendly name for the account')
    provider: str = models.CharField(max_length=200, help_text='Company providing the account')

    def __repr__(self):
        return f'<Account({self.provider}-{self.name_friendly})>'

    def __str__(self):
        return repr(self)

class Income(_base_uuid_model):
    ref: str = models.CharField(max_length=250) # TODO: Have this hooked up to an account / source?
    value: int = models.IntegerField() # TODO: https://github.com/django-money/django-money ??

    def __repr__(self):
        return f'<Income({self.ref}:${self.value/100})>'

    def __str__(self):
        return repr(self)

class Transfer(_base_uuid_model):
    ref: str = models.CharField(max_length=250) # TODO: Have this hooked up to an account / source?
    value: int = models.IntegerField() # TODO: https://github.com/django-money/django-money ??

    def __repr__(self):
        return f'<Transfer({self.ref}:${self.value/100})>'

    def __str__(self):
        return repr(self)

class Expense(_base_uuid_model):
    ref: str = models.CharField(max_length=250) # TODO: Have this hooked up to an account / source?
    value: int = models.IntegerField() # TODO: https://github.com/django-money/django-money ??
    day: int = models.PositiveSmallIntegerField()
    pay_from: Account = models.ForeignKey(Account, null=True, on_delete=models.SET_NULL, related_name='+')
    is_auto: bool = models.BooleanField(blank=True, default=False)
    comment: str = models.TextField()

    def __repr__(self):
        return f'<Expense({self.ref}:{self.day}:${self.value/100})>'

    def __str__(self):
        return repr(self)

#############################################################################################
# Template models

class Template(_base_uuid_model):
    date: str = models.CharField(max_length=10) # 'yyyy-mm-dd' / 'xxxx-mm-dd' / 'xxxx-xx-dd' / 'xxxx-mm-xx'
    # for versioning
    previous: 'Template' = models.ForeignKey('Template', null=True, on_delete=models.SET_NULL, related_name='+')
    next: 'Template' = models.ForeignKey('Template', null=True, on_delete=models.SET_NULL, related_name='+')
    #

    def __repr__(self):
        return f'<Template({self.date})>'

    def __str__(self):
        return repr(self)

class TemplateAccount(_base_uuid_model):
    template: Template = models.ForeignKey(Template, on_delete=models.CASCADE, related_name='+')
    account: Account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='+')

    def __repr__(self):
        return f'<TemplateAccount({self.template.date}:{self.account.provider}-{self.account.name_friendly})>'

    def __str__(self):
        return repr(self)

class TemplateIncome(_base_uuid_model):
    template_account: TemplateAccount = models.ForeignKey(TemplateAccount, on_delete=models.CASCADE, related_name='+')
    obj: Income = models.ForeignKey(Income, on_delete=models.CASCADE, related_name='+')
    # origin = models.ForeignKey(null=True, help_text='Links to the original source object that spawned this template, if copied')

    def __repr__(self):
        return f'<TemplateIncome({self.id})>'

    def __str__(self):
        return repr(self)

class TemplateTransfer(_base_uuid_model):
    template_account: TemplateAccount = models.ForeignKey(TemplateAccount, on_delete=models.CASCADE, related_name='+')
    obj: Transfer = models.ForeignKey(Transfer, on_delete=models.CASCADE, related_name='+')
    # origin = models.ForeignKey(null=True, help_text='Links to the original source object that spawned this template, if copied')

    def __repr__(self):
        return f'<TemplateTransfer({self.id})>'

    def __str__(self):
        return repr(self)

class TemplateExpense(_base_uuid_model):
    template_account: TemplateAccount = models.ForeignKey(TemplateAccount, on_delete=models.CASCADE, related_name='+')
    obj: Expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='+')
    # origin = models.ForeignKey(null=True, help_text='Links to the original source object that spawned this template, if copied')

    def __repr__(self):
        return f'<TemplateExpense({self.id})>'

    def __str__(self):
        return repr(self)

#############################################################################################
# Instance models

class Instance(_base_uuid_model):
    date: datetime.datetime = models.DateField()
    origin: Template = models.ForeignKey(Template, null=True, on_delete=models.SET_NULL, related_name='+', help_text='The original template that spawned this instance, if applicable')

    def __repr__(self):
        return f'<Instance({self.date})>'

    def __str__(self):
        return repr(self)

class InstanceAccount(_base_uuid_model):
    instance: Instance = models.ForeignKey(Instance, on_delete=models.CASCADE, related_name='+')
    origin: TemplateAccount = models.ForeignKey(TemplateAccount, null=True, on_delete=models.SET_NULL, related_name='+', help_text='The original template that spawned this instance, if applicable')
    account: Account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='+')
    start_balance: int = models.IntegerField() # TODO: https://github.com/django-money/django-money ??

    def __repr__(self):
        return f'<InstanceAccount({self.template.date}:{self.account.provider}-{self.account.name_friendly})>'

    def __str__(self):
        return repr(self)

class InstanceIncome(_base_uuid_model):
    instance_account: InstanceAccount = models.ForeignKey(InstanceAccount, on_delete=models.CASCADE, related_name='+')
    origin: TemplateIncome = models.ForeignKey(TemplateIncome, null=True, on_delete=models.SET_NULL, related_name='+', help_text='The original template that spawned this instance, if applicable')
    obj: Income = models.ForeignKey(Income, on_delete=models.CASCADE, related_name='+')

    def __repr__(self):
        return f'<InstanceIncome({self.id})>'

    def __str__(self):
        return repr(self)

class InstanceTransfer(_base_uuid_model):
    instance_account: InstanceAccount = models.ForeignKey(InstanceAccount, on_delete=models.CASCADE, related_name='+')
    origin: TemplateTransfer = models.ForeignKey(TemplateTransfer, null=True, on_delete=models.SET_NULL, related_name='+', help_text='The original template that spawned this instance, if applicable')
    obj: Transfer = models.ForeignKey(Transfer, on_delete=models.CASCADE, related_name='+')

    def __repr__(self):
        return f'<InstanceTransfer({self.id})>'

    def __str__(self):
        return repr(self)

class InstanceExpense(_base_uuid_model):
    instance_account: InstanceAccount = models.ForeignKey(InstanceAccount, on_delete=models.CASCADE, related_name='+')
    origin: TemplateExpense = models.ForeignKey(TemplateExpense, null=True, on_delete=models.SET_NULL, related_name='+', help_text='The original template that spawned this instance, if applicable')
    obj: Expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='+')
    is_paid: bool = models.BooleanField(default=False)

    def __repr__(self):
        return f'<InstanceExpense({self.id})>'

    def __str__(self):
        return repr(self)

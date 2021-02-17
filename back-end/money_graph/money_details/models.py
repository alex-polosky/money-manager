import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from polymorphic.models import PolymorphicModel

def _format_amount(value):
    from math import floor
    a = floor(abs(value) / 100)
    b = float(abs(value) - (a * 100)) / 100
    if value < 0:
        a = 0 - a
        b = 0 - b
    return a + b

class _base_uuid_model(models.Model):
    class Meta:
        abstract = True

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

class _base_uuid_model_poly(PolymorphicModel):
    class Meta:
        abstract = True

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

class Account(_base_uuid_model):
    class Meta:
        ordering = ['classifier', 'name_friendly']

    class Classifier(models.IntegerChoices):
        __empty__ = _('(Unknown)')
        NONE = 0, _('(None)')
        CASH = 1, _('Cash')
        CREDIT_CARD = 2, _('Credit card')
        LOAN = 3, _('Loan')
        INVESTMENT = 4, _('Investment')
        VIRTUAL = 5, _('Virtual')

    classifier = models.IntegerField(choices=Classifier.choices)
    name_transaction = models.CharField(max_length=200, unique=True, help_text='Unique name to tie to transactions')
    provider = models.CharField(max_length=200, help_text='Company providing the account')
    name_friendly = models.CharField(max_length=200, help_text='A friendly name for the account')
    is_active = models.BooleanField(default=True)

    def __repr__(self):
        return f'<Account({self.name_transaction})>'

    def __str__(self):
        return repr(self)

class AccountCurrentValue(_base_uuid_model):
    class Meta:
        ordering = ['posted', 'account__name_friendly']

    posted = models.DateField()
    amount = models.IntegerField() # TODO: https://github.com/django-money/django-money ??
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='+')

    def __repr__(self):
        return f'<AccountCurrentValue({self.account.name_transaction} : {self.amount})>'

    def __str__(self):
        return repr(self)

class Category(_base_uuid_model_poly):
    class Meta:
        ordering = ['name']

    name = models.CharField(max_length=200, unique=True)
    from_mint = models.BooleanField(default=False)

    def __repr__(self):
        return f'<Category({self.name})>'

    def __str__(self):
        return repr(self)

class SubCategory(Category):
    class Meta:
        ordering = ['category__name', 'name']

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='+')

    def __repr__(self):
        return f'<SubCategory({self.category.name}: {self.name})>'

    def __str__(self):
        return repr(self)

class Transaction(_base_uuid_model):
    class Meta:
        ordering = ['-posted']

    class Post_Type(models.IntegerChoices):
        __empty__ = _('(Unknown)')
        NONE = 0, _('(None)')
        DEBIT = 1, ('Debit')
        CREDIT = 2, ('Credit')

    posted = models.DateField()
    description = models.CharField(max_length=300)
    description_from_source = models.CharField(max_length=500)
    amount = models.IntegerField() # TODO: https://github.com/django-money/django-money ??
    post_type = models.IntegerField(choices=Post_Type.choices)
    notes = models.TextField(null=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='+')

    def __repr__(self):
        isDebit = self.post_type == Transaction.Post_Type.DEBIT
        amount = _format_amount(self.amount)
        if isDebit:
            amount = 0 - amount
        amount = str(amount)
        if len(amount.split('.')[1]) < 2:
            amount += '0'
        return f'<Transaction({self.posted} [{self.account.name_transaction}] - {self.description[:50]} [{amount}] )>'

    def __str__(self):
        return repr(self)

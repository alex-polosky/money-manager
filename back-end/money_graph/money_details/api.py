from rest_framework import routers, serializers, viewsets
from . import models as money_details

class AccountSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    classifier = serializers.ChoiceField(money_details.Account.Classifier.choices)
    name_transaction = serializers.CharField(max_length=200)
    provider = serializers.CharField(max_length=200)
    name_friendly = serializers.CharField(max_length=200)
    is_active = serializers.BooleanField()

    class Meta:
        model = money_details.Account
        fields = '__all__'

class AccountViewSet(viewsets.ModelViewSet):
    queryset = money_details.Account.objects.all()
    serializer_class = AccountSerializer


class AccountCurrentValueSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_details.AccountCurrentValue
        fields = '__all__'

class AccountCurrentValueSet(viewsets.ModelViewSet):
    queryset = money_details.AccountCurrentValue.objects.all()
    serializer_class = AccountCurrentValueSerializer


class CategorySerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_details.Category
        # fields = '__all__'
        exclude = ('polymorphic_ctype',)

class CategorySet(viewsets.ModelViewSet):
    queryset = money_details.Category.objects.all().not_instance_of(money_details.SubCategory)
    serializer_class = CategorySerializer


class SubCategorySerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_details.SubCategory
        # fields = '__all__'
        exclude = ('polymorphic_ctype',)

class SubCategorySet(viewsets.ModelViewSet):
    queryset = money_details.SubCategory.objects.all().instance_of(money_details.SubCategory)
    serializer_class = SubCategorySerializer


class TransactionSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_details.Transaction
        fields = '__all__'

class TransactionSet(viewsets.ModelViewSet):
    queryset = money_details.Transaction.objects.all()
    serializer_class = TransactionSerializer


router = routers.DefaultRouter()
router.register(r'account', AccountViewSet)
router.register(r'accountcurrentvalue', AccountCurrentValueSet)
router.register(r'category', CategorySet)
router.register(r'subcategory', SubCategorySet)
router.register(r'transaction', TransactionSet)

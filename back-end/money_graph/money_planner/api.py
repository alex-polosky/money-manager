from rest_framework import routers, serializers, viewsets
from . import models as money_planner

#############################################################################################
# Base models needed to operate

class AccountSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.Account
        fields = '__all__'

class AccountSet(viewsets.ModelViewSet):
    queryset = money_planner.Account.objects.all()
    serializer_class = AccountSerializer


class IncomeSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.Income
        fields = '__all__'

class IncomeSet(viewsets.ModelViewSet):
    queryset = money_planner.Income.objects.all()
    serializer_class = IncomeSerializer


class TransferSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.Transfer
        fields = '__all__'

class TransferSet(viewsets.ModelViewSet):
    queryset = money_planner.Transfer.objects.all()
    serializer_class = TransferSerializer


class ExpenseSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.Expense
        fields = '__all__'

class ExpenseSet(viewsets.ModelViewSet):
    queryset = money_planner.Expense.objects.all()
    serializer_class = ExpenseSerializer


#############################################################################################
# Template models

class TemplateSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.Template
        fields = '__all__'

class TemplateSet(viewsets.ModelViewSet):
    queryset = money_planner.Template.objects.all()
    serializer_class = TemplateSerializer


class TemplateAccountSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.TemplateAccount
        fields = '__all__'

class TemplateAccountSet(viewsets.ModelViewSet):
    queryset = money_planner.TemplateAccount.objects.all()
    serializer_class = TemplateAccountSerializer


class TemplateIncomeSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.TemplateIncome
        fields = '__all__'

class TemplateIncomeSet(viewsets.ModelViewSet):
    queryset = money_planner.TemplateIncome.objects.all()
    serializer_class = TemplateIncomeSerializer


class TemplateTransferSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.TemplateTransfer
        fields = '__all__'

class TemplateTransferSet(viewsets.ModelViewSet):
    queryset = money_planner.TemplateTransfer.objects.all()
    serializer_class = TemplateTransferSerializer


class TemplateExpenseSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.TemplateExpense
        fields = '__all__'

class TemplateExpenseSet(viewsets.ModelViewSet):
    queryset = money_planner.TemplateExpense.objects.all()
    serializer_class = TemplateExpenseSerializer


#############################################################################################
# Instance models

class InstanceSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.Instance
        fields = '__all__'

class InstanceSet(viewsets.ModelViewSet):
    queryset = money_planner.Instance.objects.all()
    serializer_class = InstanceSerializer


class InstanceAccountSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.InstanceAccount
        fields = '__all__'

class InstanceAccountSet(viewsets.ModelViewSet):
    queryset = money_planner.InstanceAccount.objects.all()
    serializer_class = InstanceAccountSerializer


class InstanceIncomeSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.InstanceIncome
        fields = '__all__'

class InstanceIncomeSet(viewsets.ModelViewSet):
    queryset = money_planner.InstanceIncome.objects.all()
    serializer_class = InstanceIncomeSerializer


class InstanceTransferSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.InstanceTransfer
        fields = '__all__'

class InstanceTransferSet(viewsets.ModelViewSet):
    queryset = money_planner.InstanceTransfer.objects.all()
    serializer_class = InstanceTransferSerializer


class InstanceExpenseSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = money_planner.InstanceExpense
        fields = '__all__'

class InstanceExpenseSet(viewsets.ModelViewSet):
    queryset = money_planner.InstanceExpense.objects.all()
    serializer_class = InstanceExpenseSerializer

router = routers.DefaultRouter()
router.register(r'account', AccountSet)
router.register(r'income', IncomeSet)
router.register(r'transfer', TransferSet)
router.register(r'expense', ExpenseSet)

router.register(r'template', TemplateSet)
router.register(r'templateaccount', TemplateAccountSet)
router.register(r'templateincome', TemplateIncomeSet)
router.register(r'templatetransfer', TemplateTransferSet)
router.register(r'templateexpense', TemplateExpenseSet)

router.register(r'instance', InstanceSet)
router.register(r'instanceaccount', InstanceAccountSet)
router.register(r'instanceincome', InstanceIncomeSet)
router.register(r'instancetransfer', InstanceTransferSet)
router.register(r'instanceexpense', InstanceExpenseSet)

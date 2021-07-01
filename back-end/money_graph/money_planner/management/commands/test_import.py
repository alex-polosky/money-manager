import base64
import datetime
import json
from dateutil import parser
from typing import Any, Callable, Dict, List, Optional
from django.db import transaction
from django.core.management.base import BaseCommand, CommandError, CommandParser
from money_graph.money_planner import models as money_planner

FILE_EX = 'S:/code/local/money-stuff/inc/example-expense-estimator-thing.json'

class Command(BaseCommand):

    def add_arguments(self, parser: CommandParser) -> None:
        return super().add_arguments(parser)

    def handle(self, *args: Any, **options: Any) -> Optional[str]:
        self._import(self._load())

    def _load(self):
        with open(FILE_EX, 'r') as f:
            return json.load(f)

    @transaction.atomic
    def _import(self, data):
        accounts: Dict[str, money_planner.Account] = {}
        # templates: List[money_planner.Template] = []
        # instances: List[money_planner.Instance] = []

        for x in [
            ['PNC', 'Main CC', 'PNC'],
            ['CapOnePlat', 'Platinum', 'Capital One'],
            ['CapOneQS', 'Quicksilver', 'Capital One'],
            ['Discover', 'Backup CC', 'Discover'],
        ]:
            account = money_planner.Account(name_friendly=x[1], provider=x[2])
            account.save()
            accounts[x[0]] = account

        _mtoi = lambda x: int(round(x, 2) * 100)

        for d_template in data['templates']:
            template = money_planner.Template()
            _format = lambda x, length=2: str(x).rjust(length, '0') if x else ''.rjust(length, 'x')
            template.date = '{0}-{1}-{2}'.format(
                _format(d_template['date']['year'], 4),
                _format(d_template['date']['month']),
                _format(d_template['date']['day'])
            )
            template.save()

            for d_account in d_template['accounts']:
                pn = '{0}-{1}'.format(d_account['provider'], d_account['name'])
                if pn not in accounts:
                    account = money_planner.Account(name_friendly=d_account['name'], provider=d_account['provider'])
                    account.save()
                    accounts[pn] = account
                else:
                    account = accounts[pn]
                template_account = money_planner.TemplateAccount(template=template, account=account)
                template_account.save()

                for d_income in d_account['income']:
                    income = money_planner.Income(ref=d_income['ref'], value=_mtoi(d_income['value']))
                    income.save()
                    t_income = money_planner.TemplateIncome(template_account=template_account, obj=income)
                    t_income.save()

                for d_transfer in d_account['transfer']:
                    transfer = money_planner.Transfer(ref=d_transfer['ref'], value=_mtoi(d_transfer['value']))
                    transfer.save()
                    t_transfer = money_planner.TemplateTransfer(template_account=template_account, obj=transfer)
                    t_transfer.save()

                for d_expense in d_account['expenses']:
                    expense = money_planner.Expense(
                        ref=d_expense['name'],
                        value=_mtoi(d_expense['value']),
                        pay_from=accounts[d_expense['paidFrom']] if d_expense['paidFrom'] else None,
                        is_auto=d_expense['auto'],
                        comment=d_expense['comment'],
                        day=d_expense['day']
                    )
                    expense.save()
                    t_expense = money_planner.TemplateExpense(template_account=template_account, obj=expense)
                    t_expense.save()

        for d_instance in data['history']:
            instance = money_planner.Instance(date=datetime.datetime.strptime(d_instance['date'], '%Y-%m-%d')) 
            instance.save()

            for d_account in d_instance['accounts']:
                pn = '{0}-{1}'.format(d_account['provider'], d_account['name'])
                if pn not in accounts:
                    account = money_planner.Account(name_friendly=d_account['name'], provider=d_account['provider'])
                    account.save()
                    accounts[pn] = account
                else:
                    account = accounts[pn]
                instance_account = money_planner.InstanceAccount(instance=instance, account=account, start_balance=_mtoi(d_account['balance']))
                instance_account.save()

                for d_income in d_account['income']:
                    income = money_planner.Income(ref=d_income['ref'], value=_mtoi(d_income['value']))
                    income.save()
                    t_income = money_planner.InstanceIncome(instance_account=instance_account, obj=income)
                    t_income.save()

                for d_transfer in d_account['transfer']:
                    transfer = money_planner.Transfer(ref=d_transfer['ref'], value=_mtoi(d_transfer['value']))
                    transfer.save()
                    t_transfer = money_planner.InstanceTransfer(instance_account=instance_account, obj=transfer)
                    t_transfer.save()

                for d_expense in d_account['expenses']:
                    expense = money_planner.Expense(
                        ref=d_expense['name'],
                        value=_mtoi(d_expense['value']),
                        pay_from=accounts[d_expense['paidFrom']] if d_expense['paidFrom'] else None,
                        is_auto=d_expense['auto'],
                        comment=d_expense['comment'],
                        day=d_expense['day']
                    )
                    expense.save()
                    t_expense = money_planner.InstanceExpense(instance_account=instance_account, obj=expense, is_paid=d_expense['isPaid'])
                    t_expense.save()

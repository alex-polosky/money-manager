import base64
import csv
from dateutil import parser
from typing import Any, Callable, Optional
from django.db import transaction
from django.core.management.base import BaseCommand, CommandError, CommandParser
from money_graph.money_details import models as money_details

FILE_ACCS = 'S:/code/local/money-stuff/inc/accounts.csv'
FILE_CATS = 'S:/code/local/money-stuff/inc/categories.csv'
FILE_TRAS = 'S:/code/local/money-stuff/inc/transactions.csv'

class Command(BaseCommand):

    def add_arguments(self, parser: CommandParser) -> None:
        return super().add_arguments(parser)

    def handle(self, *args: Any, **options: Any) -> Optional[str]:
        self._load_current_cats()
        self._read_csv(FILE_CATS, self._handle_cats)
        self._load_current_accs()
        self._read_csv(FILE_ACCS, self._handle_accs)
        # TODO: implement some type of hash for transactions to not import the same ones
        self._read_csv(FILE_TRAS, self._handle_tras)

    @transaction.atomic
    def _read_csv(self, fPath: str, onRow: Callable[[Any, int], None]) -> None:
        with open (fPath, newline='') as csv_f:
            csv_r = csv.reader(csv_f)
            headers = None
            i = 0
            for row in csv_r:
                if not headers:
                    headers = row
                    continue
                onRow(dict(zip(headers, row)), i)
                i += 1

    def _load_current_cats(self) -> None:
        self._cats = {}
        self._subcats = {}
        cat: money_details.Category
        subcat: money_details.SubCategory
        for cat in money_details.Category.objects.all():
            self._cats[cat.name] = cat
        for subcat in money_details.SubCategory.objects.all():
            self._subcats[subcat.name] = subcat

    def _handle_cats(self, row, index) -> None:
        # TODO: get rid of dependency on header names
        cat_name = row['Category']
        sub_cat_name = row['SubCategory']
        from_mint = row['BuiltIn']
        if from_mint.upper() in ('TRUE', '1', 'Y', 'YES'):
            from_mint = True
        else:
            from_mint = False

        if cat_name in self._cats:
            cat = self._cats[cat_name]
        else:
            cat = money_details.Category(name=cat_name, from_mint=from_mint)
            cat.origin_key = cat.generate_origin_key('mint')
            try:
                cat.save()
            except BaseException as ex:
                self.stderr.write(f'Error saving category with name {cat_name}')
                raise ex
            self._cats[cat.name] = cat

        if sub_cat_name not in self._subcats and sub_cat_name != cat_name:
            sub_cat = money_details.SubCategory(name=sub_cat_name, category=cat)
            sub_cat.origin_key = sub_cat.generate_origin_key('mint')
            try:
                sub_cat.save()
            except BaseException as ex:
                self.stderr.write(f'Error saving sub-category with name {sub_cat_name}')
                raise ex
            # self._subcats[sub_cat.name] = sub_cat.id
            self._subcats[sub_cat.name] = sub_cat

        # self.stdout.write(row)

    def _load_current_accs(self) -> None:
        self._accs = {}
        acc: money_details.Account
        for acc in money_details.Account.objects.all():
            self._accs[acc.name_transaction] = acc

    def parse_int(self, i: str):
        a = int(i.split('.')[0].replace(',', '')) * 100
        b = int(i.split('.')[1]) if len(i.split('.')) > 1 else 0
        if a >= 0:
            return a + b
        else:
            return a - b

    def _handle_accs(self, row, index) -> None:
        # TODO: get rid of dependency on header names
        classifier = dict(zip([''.join(x.upper().split()) for x in money_details.Account.Classifier.labels], money_details.Account.Classifier.values))

        if row['TransactionName'] in self._accs:
            acc = self._accs[row['TransactionName']]
        else:
            acc = money_details.Account(
                classifier=classifier[''.join(row['Type'].upper().split())],
                name_transaction=row['TransactionName'],
                provider=row['Provider'],
                name_friendly=row['Name'],
                is_active=not (row['IsActive'].upper() in ('FALSE', 'NO', 'N', '0'))
            )
            acc.origin_key = acc.generate_origin_key('mint')
            acc.save()
            self._accs[acc.name_transaction] = acc

        money_details.AccountCurrentValue.objects.get_or_create(
            account_id=acc.id,
            amount=self.parse_int(row['Current']),
            posted=parser.parse(row['DateOfCurrent']).date()
        )

    def _handle_tras(self, row, index) -> None:
        # TODO: get rid of dependency on header names
        post_type = dict(zip([''.join(x.upper().split()) for x in money_details.Transaction.Post_Type.labels], money_details.Transaction.Post_Type.values))

        try:
            trans = money_details.Transaction(
                posted=parser.parse(row['Date']).date(),
                description=row['Description'],
                description_from_source=row['Original Description'],
                amount=self.parse_int(row['Amount']),
                post_type=post_type[''.join(row['Transaction Type'].upper().split())],
                notes=row['Notes'],
                account=self._accs[row['Account Name']],
                category=self._subcats[row['SubCategory']] if row['SubCategory'] in self._subcats else self._cats[row['SubCategory']]
            )
            trans.origin_key = trans.generate_origin_key('mint')
            trans.save()
        except BaseException as ex:
            print(index)
            raise ex

import { Api } from '../api/api';
import { ArrayApiLoader } from '../arrayLoader';
import { dton, ensureDate } from '../helper';
import * as MoneyPlanner from '../models/money-planner/models';

export class MoneyPlannerController {
    public readonly accounts: ArrayApiLoader<MoneyPlanner.Account>;
    public readonly expenses: ArrayApiLoader<MoneyPlanner.Expense>;
    public readonly incomes: ArrayApiLoader<MoneyPlanner.Income>;
    public readonly instances: ArrayApiLoader<MoneyPlanner.Instance>;
    public readonly instanceAccounts: ArrayApiLoader<MoneyPlanner.InstanceAccount>;
    public readonly instanceExpenses: ArrayApiLoader<MoneyPlanner.InstanceExpense>;
    public readonly instanceIncomes: ArrayApiLoader<MoneyPlanner.InstanceIncome>;
    public readonly instanceTransfers: ArrayApiLoader<MoneyPlanner.InstanceTransfer>;
    public readonly templates: ArrayApiLoader<MoneyPlanner.Template>;
    public readonly templateAccounts: ArrayApiLoader<MoneyPlanner.TemplateAccount>;
    public readonly templateExpenses: ArrayApiLoader<MoneyPlanner.TemplateExpense>;
    public readonly templateIncomes: ArrayApiLoader<MoneyPlanner.TemplateIncome>;
    public readonly templateTransfers: ArrayApiLoader<MoneyPlanner.TemplateTransfer>;
    public readonly transfers: ArrayApiLoader<MoneyPlanner.Transfer>;

    public get isLoaded(): boolean {
        return this.accounts.isReady
            && this.expenses.isReady
            && this.incomes.isReady
            && this.instances.isReady
            && this.instanceAccounts.isReady
            && this.instanceExpenses.isReady
            && this.instanceIncomes.isReady
            && this.instanceTransfers.isReady
            && this.templates.isReady
            && this.templateAccounts.isReady
            && this.templateExpenses.isReady
            && this.templateIncomes.isReady
            && this.templateTransfers.isReady
            && this.transfers.isReady;
    }

    constructor(api: Api) {
        this.accounts = new ArrayApiLoader(api.moneyPlanner.account);
        this.expenses = new ArrayApiLoader(api.moneyPlanner.expense, (each) => {
            each.value = dton(each.value);
        });
        this.incomes = new ArrayApiLoader(api.moneyPlanner.income, (each) => {
            each.value = dton(each.value);
        });
        this.instances = new ArrayApiLoader(api.moneyPlanner.instance, (each) => {
            each.date = ensureDate(each.date);
            each.accounts = [];
        });
        this.instanceAccounts = new ArrayApiLoader(api.moneyPlanner.instanceaccount, (each) => {
            each.start_balance = dton(each.start_balance);
            each.expenses = [];
            each.incomes = [];
            each.transfers = [];
        });
        this.instanceExpenses = new ArrayApiLoader(api.moneyPlanner.instanceexpense);
        this.instanceIncomes = new ArrayApiLoader(api.moneyPlanner.instanceincome);
        this.instanceTransfers = new ArrayApiLoader(api.moneyPlanner.instancetransfer);
        this.templates = new ArrayApiLoader(api.moneyPlanner.template);
        this.templateAccounts = new ArrayApiLoader(api.moneyPlanner.templateaccount);
        this.templateExpenses = new ArrayApiLoader(api.moneyPlanner.templateexpense);
        this.templateIncomes = new ArrayApiLoader(api.moneyPlanner.templateincome);
        this.templateTransfers = new ArrayApiLoader(api.moneyPlanner.templatetransfer);
        this.transfers = new ArrayApiLoader(api.moneyPlanner.transfer, (each) => {
            each.value = dton(each.value);
        });
    }

    public loadAll(afterEachLoad?: () => void, afterAllLoad?: () => void) {
        return Promise.all([
            this.accounts.load(() => afterEachLoad?.()),
            this.expenses.load(() => afterEachLoad?.()),
            this.incomes.load(() => afterEachLoad?.()),
            this.instances.load(() => afterEachLoad?.()),
            this.instanceAccounts.load(() => afterEachLoad?.()),
            this.instanceExpenses.load(() => afterEachLoad?.()),
            this.instanceIncomes.load(() => afterEachLoad?.()),
            this.instanceTransfers.load(() => afterEachLoad?.()),
            this.templates.load(() => afterEachLoad?.()),
            this.templateAccounts.load(() => afterEachLoad?.()),
            this.templateExpenses.load(() => afterEachLoad?.()),
            this.templateIncomes.load(() => afterEachLoad?.()),
            this.templateTransfers.load(() => afterEachLoad?.()),
            this.transfers.load(() => afterEachLoad?.())
        ]).then(() => {
            afterAllLoad?.();
            afterEachLoad?.();
        });
    }

    public map(): void {
        var accountMap = new Map(this.accounts.map(x => [x.id, x]));
        var expenseMap = new Map(this.expenses.map(x => [x.id, x]));
        var incomeMap = new Map(this.incomes.map(x => [x.id, x]));
        var instanceMap = new Map(this.instances.map(x => [x.id, x]));
        var instanceAccountMap = new Map(this.instanceAccounts.map(x => [x.id, x]));
        // var instanceExpenseMap = new Map(this.instanceExpenses.map(x => [x.id, x]));
        // var instanceIncomeMap = new Map(this.instanceIncomes.map(x => [x.id, x]));
        // var instanceTransferMap = new Map(this.instanceTransfers.map(x => [x.id, x]));
        var templateMap = new Map(this.templates.map(x => [x.id, x]));
        var templateAccountMap = new Map(this.templateAccounts.map(x => [x.id, x]));
        var templateExpenseMap = new Map(this.templateExpenses.map(x => [x.id, x]));
        var templateIncomeMap = new Map(this.templateIncomes.map(x => [x.id, x]));
        var templateTransferMap = new Map(this.templateTransfers.map(x => [x.id, x]));
        var transferMap = new Map(this.transfers.map(x => [x.id, x]));

        for (let each of this.expenses) {
            each.pay_from = accountMap.get(each.pay_from as string);
        }
        for (let each of this.instances) {
            each.origin = templateMap.get(each.origin as string);
        }
        for (let each of this.instanceAccounts) {
            each.instance = instanceMap.get(each.instance as string) as MoneyPlanner.Instance;
            each.instance.accounts.push(each);
            each.origin = templateAccountMap.get(each.origin as string);
            each.account = accountMap.get(each.account as string) as MoneyPlanner.Account;
        }
        for (let each of this.instanceExpenses) {
            each.instance_account = instanceAccountMap.get(each.instance_account as string) as MoneyPlanner.InstanceAccount;
            each.instance_account.expenses.push(each);
            each.origin = templateExpenseMap.get(each.origin as string);
            each.obj = expenseMap.get(each.obj as string) as MoneyPlanner.Expense;
        }
        for (let each of this.instanceIncomes) {
            each.instance_account = instanceAccountMap.get(each.instance_account as string) as MoneyPlanner.InstanceAccount;
            each.instance_account.incomes.push(each);
            each.origin = templateIncomeMap.get(each.origin as string);
            each.obj = incomeMap.get(each.obj as string) as MoneyPlanner.Income;
        }
        for (let each of this.instanceTransfers) {
            each.instance_account = instanceAccountMap.get(each.instance_account as string) as MoneyPlanner.InstanceAccount;
            each.instance_account.transfers.push(each);
            each.origin = templateTransferMap.get(each.origin as string);
            each.obj = transferMap.get(each.obj as string) as MoneyPlanner.Transfer;
        }
        for (let each of this.templates) {
            each.previous = templateMap.get(each.previous as string);
            each.next = templateMap.get(each.next as string);
        }
        for (let each of this.templateAccounts) {
            each.template = templateMap.get(each.template as string) as MoneyPlanner.Template;
            each.account = accountMap.get(each.account as string) as MoneyPlanner.Account;
        }
        for (let each of this.templateExpenses) {
            each.template = templateAccountMap.get(each.template as string) as MoneyPlanner.TemplateAccount;
            each.expense = expenseMap.get(each.expense as string) as MoneyPlanner.Expense;
        }
        for (let each of this.templateIncomes) {
            each.template = templateAccountMap.get(each.template as string) as MoneyPlanner.TemplateAccount;
            each.income = incomeMap.get(each.income as string) as MoneyPlanner.Income;
        }
        for (let each of this.templateTransfers) {
            each.template = templateAccountMap.get(each.template as string) as MoneyPlanner.TemplateAccount;
            each.transfer = transferMap.get(each.transfer as string) as MoneyPlanner.Transfer;
        }
    }
}
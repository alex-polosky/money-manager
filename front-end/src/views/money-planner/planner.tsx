import './planner.css';

import { InstanceAccount } from '../../models/money-planner/InstanceAccount';
import { MoneyPlannerController } from "../../controllers/MoneyPlanner";
import { isAccount } from "../../models/money-planner/Account";
import { isExpense } from "../../models/money-planner/Expense";
import { isIncome } from "../../models/money-planner/Income";
import { isInstance } from '../../models/money-planner/Instance';
import { isTransfer } from "../../models/money-planner/Transfer";
import loading from "../../components/loading";

interface PlannerViewProps {
    controller: MoneyPlannerController;
}

interface PlannerViewState {
}

export default function PlannerView(props: Readonly<PlannerViewProps>) {
    const calculateSum = (account: InstanceAccount): number =>  {
        let total = account.start_balance;
        // Grab other transfers to this account
        if (isAccount(account.account) && isInstance(account.instance)) {
            for (const otherAccount of account.instance.accounts) {
                if (otherAccount.id === account.id) {
                    continue;
                }
                for (const transfer of otherAccount.transfers) {
                    if (isTransfer(transfer.obj)) {
                        const [provider, name] = transfer.obj.ref.split('-');
                        if (provider === account.account.provider && name === account.account.name_friendly) {
                            total += transfer.obj.value;
                        }
                    }
                }
            }
        }
        for (const transfer of account.transfers) {
            if (isTransfer(transfer.obj)) {
                total -= transfer.obj.value;
            }
        }
        for (const income of account.incomes) {
            if (isIncome(income.obj)) {
                total += income.obj.value;
            }
        }
        for (const expense of account.expenses) {
            if (isExpense(expense.obj) && (expense.obj.pay_from === null || expense.obj.pay_from === undefined)) {
                total += expense.obj.value;
            }
        }
        return total;
    }

    return (
        !props.controller.isLoaded ?
        loading() :
        <div style={{padding: '2em'}}>{props.controller.instances.map((instance) => (
            <table>
                <tr>
                    <th>
                        {`${instance.date.getFullYear()}/${instance.date.getMonth() + 1}/${instance.date.getDate()}`}
                    </th>
                </tr>
                <tr>
                {instance.accounts.map((instanceAccount) => (
                    <td>
                        <table>
                            <tr>
                                <th>{isAccount(instanceAccount.account) ? `${instanceAccount.account.provider}-${instanceAccount.account.name_friendly}` : 'find something to do with account here?'}</th>
                                <th className="money-cell">{instanceAccount.start_balance.toFixed(2)}</th>
                            </tr>
                            {instanceAccount.transfers.map((each) =>
                                isTransfer(each.obj) ?
                                <tr>
                                    <td>{each.obj.ref}</td>
                                    <td className="money-cell">{each.obj.value.toFixed(2)}</td>
                                </tr> : <tr></tr>
                            )}
                            {instanceAccount.incomes.map((each) =>
                                isIncome(each.obj) ?
                                <tr>
                                    <td>{each.obj.ref}</td>
                                    <td className="money-cell">{each.obj.value.toFixed(2)}</td>
                                </tr> : <tr></tr>
                            )}
                            {instanceAccount.expenses.map((each) =>
                                isExpense(each.obj) ?
                                <tr>
                                    <td>{each.obj.ref}</td>
                                    <td className="money-cell">{each.obj.value.toFixed(2)}</td>
                                    <td>{each.obj.is_auto ? "Auto" : ""}</td>
                                    <td>PF: {isAccount(each.obj.pay_from) ? each.obj.pay_from.name_friendly : each.obj.pay_from}</td>
                                    <td>{each.obj.comment}</td>
                                </tr> : <tr></tr>
                            )}
                        </table>
                    </td>
                ))}
                </tr>
                <tr>
                    {instance.accounts.map((instanceAccount) => (
                        <td>Total: <span className="money-cell">{calculateSum(instanceAccount).toFixed(2)}</span></td>
                    ))}
                </tr>
            </table>
        ))}</div>
    );
}
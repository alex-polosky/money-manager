import { Account, isAccount } from '../../models/money-details/Account';
import { Category, isCategory } from '../../models/money-details/Category';
import { EditableColumnType, EditableTable } from '../EditableTable';
import { PostType, Transaction } from "../../models/money-details/Transaction";
import { SubCategory, isSubCategory } from '../../models/money-details/SubCategory';

import { Popconfirm } from 'antd';
import { renderShortDate } from '../../helper';

interface TransactionGridViewProps {
    accounts: Account[];
    categories: Category[];
    objects: Transaction[];
}
interface TransactionGridViewState {
}

const TransactionGrid = (props: TransactionGridViewProps) => {
    const COLUMNS: EditableColumnType<Transaction>[] = [
        {
            title: 'Posted',
            dataIndex: 'posted',
            editable: true,
            editCell: 'date',
            render: ((date: Date) => renderShortDate(date))
        },
        {
            title: 'Account',
            dataIndex: 'account',
            editable: true,
            editOptions: props.accounts,
            editGetOptionByValue: (id: string): Account => props.accounts.filter(x => x.id === id)[0],
            editRenderValue: (account: Account): string => account.id,
            editRenderLabel: (account: Account): string => `${account.provider}: ${account.name_friendly}`,
            render: ((account: Account | string) => isAccount(account) ? `${account.provider}: ${account.name_friendly}` : account)
        },
        {
            title: 'Description',
            dataIndex: 'description',
            editable: true
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            editable: true,
            editCell: 'currency',
            render: ((amount: number, record: Transaction) => `${record.post_type === PostType.DEBIT ? '-' : ''}$${amount.toFixed(2)}`)
        },
        {
            title: 'Category',
            key: 'category',
            editable: true,
            // dataIndex: ['category', 'category', 'name'],
            dataIndex: 'category',
            editOptions: props.categories,
            editGetOptionByValue: (id: string): Category | SubCategory => props.categories.filter(x => x.id === id)[0],
            editRenderValue: (category: Category | SubCategory): string => category.id,
            editRenderLabel: (category: Category | SubCategory): string => isSubCategory(category)
                ? `${(category.category as Category).name}: ${category.name}`
                : category.name,
            render: ((_: string, record: Transaction) =>
                isSubCategory(record.category)
                    ? `${(record.category.category as Category).name}: ${record.category.name}`
                    : isCategory(record.category)
                        ? record.category.name
                        : record.category
            )
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: Transaction) =>
              props.objects.length >= 1 ? (
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                  <a>Delete</a>
                </Popconfirm>
              ) : null,
          },
    ];
    const handleDelete = (transactionId: string) => {
        console.log(transactionId);
    }
    const handleSave = (row: Transaction) => {
        console.log(row);
    }
    return (
        <EditableTable
            columns={COLUMNS}
            dataSource={props.objects}
            handleSave={handleSave}
        />
    );
};

export default TransactionGrid;
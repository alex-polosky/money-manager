import { AutoComplete, Dropdown, Form, FormInstance, Input, Menu, Table } from 'antd';
import generatePicker, { PickerProps } from 'antd/lib/date-picker/generatePicker';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import React from 'react';
import { useEffect } from 'react';
import { useContext, useRef, useState } from 'react';
import dateConfig from '../components/antd-generateDate';

const DatePicker = generatePicker<Date>(dateConfig);

const EditableContext = React.createContext<FormInstance<any>>(undefined as any);

export interface EditableColumn<RecordType> {
    editable?: boolean;
    editCell?: 'input' | 'textarea' | 'date' | 'numeric' | 'currency';
    editOptions?: any[];
    editGetOptionByValue?: (value: any) => any,
    editRenderValue?: (value: any) => string,
    editRenderLabel?: (value: any) => React.ReactNode,
    afterEdit?: (value: any) => void;
}
export interface EditableColumnType<RecordType> extends ColumnType<RecordType>, EditableColumn<RecordType> { }
export interface EditableColumnGroupType<RecordType> extends ColumnGroupType<RecordType>, EditableColumn<RecordType> { }
export declare type EditableColumnsType<RecordType> = (ColumnGroupType<RecordType> | ColumnType<RecordType> | EditableColumnGroupType<RecordType> | EditableColumnType<RecordType>)[]

export const EditableRow = ({index, ...props}: { index: any, [id: string]: any}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    )
}

export interface EditableCellProps<T> extends EditableColumn<T> {
    title: any,
    children?: any,
    dataIndex: string,
    record: T,
    handleSave: (record: T) => void,
    [id: string]: any
};

export const EditableCell = <T extends { [key: string]: any }>({
    title,
    editable,
    editCell,
    editOptions,
    editGetOptionByValue,
    editRenderValue,
    editRenderLabel,
    afterEdit,
    children,
    dataIndex,
    record,
    handleSave,
    ...props
}: EditableCellProps<T>) => {
    const [editing, setEditing] = useState(false);
    const form = useContext(EditableContext);
    const inputRef = useRef<any>();
    // const inputRef = useRef<Input>(null);
    // const pickerRef = useRef<React.Component<PickerProps<Date>, any, any>>() as React.MutableRefObject<React.Component<PickerProps<Date>, any, any>>;
    // const pickerRef = useRef<any>();
    useEffect(() => {
        if (editing) {
            inputRef?.current?.focus();
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: editRenderValue?.(record[dataIndex]) ?? record[dataIndex]
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        }
        catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        if (editing) {
            childNode = (
            <Form.Item
                style={{
                    margin: 0
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`
                    }
                ]}
            >
                {(() => {
                    if (editOptions !== undefined) {
                        const autoCompleteLoseFocus = async () => {
                            try {
                                const values = form.getFieldsValue();
                                const value = editGetOptionByValue?.(values[dataIndex]) ?? values[dataIndex];
                                form.setFieldsValue({ [dataIndex]: value });
                                save();
                            }
                            catch (err) {
                                console.log(err);
                            }
                        };
                        return (
                            <AutoComplete
                                options={editOptions.map((option, index) => ({
                                    key: index,
                                    value: editRenderValue?.(option) ?? option,
                                    label: editRenderLabel?.(option) ?? option
                                }))}
                                // onBlur={autoCompleteLoseFocus}
                                onDropdownVisibleChange={(open) => open ? null : autoCompleteLoseFocus()}
                                // onChange={autoCompleteChange}
                                autoFocus={true}
                                backfill={true}
                                defaultActiveFirstOption={false}
                                defaultOpen={true}
                                // defaultValue={''}
                            >
                                <Input.Search ref={inputRef} />
                            </AutoComplete>
                        )
                    }
                    if (editCell == null) {
                        editCell = 'input';
                    }
                    switch(editCell) {
                        case 'input':
                            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
                        case 'textarea':
                            console.warn('Textarea cell edit not implemented yet');
                            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
                        case 'date':
                            // return <DatePicker ref={pickerRef} onChange={save} onBlur={() => console.log('hi')} defaultOpen={true} />;
                            return <DatePicker ref={inputRef} onBlur={save} defaultOpen={true} />;
                        case 'numeric':
                            console.warn('Numeric cell edit not implemented yet');
                            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
                        case 'currency':
                            console.warn('Currency cell edit not implemented yet');
                            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
                    }
                })()}
            </Form.Item>
            );
        } else {
            childNode = (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
            );
        }
    }

    return <td { ...props }>{childNode}</td>
}

export const EditableCellBak = <T extends { [key: string]: any }>({
    title,
    editable,
    editCell,
    editOptions,
    editRenderValue,
    editRenderLabel,
    afterEdit,
    children,
    dataIndex,
    record,
    handleSave,
    ...props
}: EditableCellProps<T>) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<any>();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef?.current?.focus();
        }
    }, [editing])

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex]
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        }
        catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`
                    }
                ]}
            >
                {(() => {
                    if (editOptions !== undefined) {
                        // const menu = (
                        //     <Menu>
                        //         <Menu.Item>Test</Menu.Item>
                        //         <Menu.Item>Test3</Menu.Item>
                        //     </Menu>
                        // );
                        // return (
                        //     <Dropdown.Button overlay={menu}>
                        //         Test
                        //     </Dropdown.Button>
                        // );
                        const autoCompleteChange = async () => {
                            try {
                                const values = await form.validateFields();
                                const value = values[dataIndex];
                                // if (editOptions.)
                                console.log(values);
                                // toggleEdit();
                            }
                            catch (err) {
                                console.log(err);
                            }
                        };
                        return (
                            <AutoComplete
                                // options={[{value: '2424-24324-4243432-2424', label: 'test'}, {value: '646-7575-7575-7575', label: 'asdf'}]}
                                options={editOptions.map((option, index) => ({
                                    key: index,
                                    value: editRenderValue?.(option) ?? option,
                                    label: editRenderLabel?.(option) ?? option
                                }))}
                                // onBlur={autoCompleteLoseFocus}
                                onChange={autoCompleteChange}
                                autoFocus={true}
                                backfill={true}
                                defaultActiveFirstOption={false}
                                defaultOpen={true}
                                // defaultValue={''}
                            >
                                <Input.Search ref={inputRef} />
                            </AutoComplete>
                        )
                    }
                    if (editCell == null) {
                        editCell = 'input';
                    }
                    switch(editCell) {
                        case 'input':
                            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
                        case 'textarea':
                            console.warn('Textarea cell edit not implemented yet');
                            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
                        case 'date':
                            return <DatePicker ref={inputRef} onBlur={save} defaultOpen={true} />;
                        case 'numeric':
                            console.warn('Numeric cell edit not implemented yet');
                            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
                        case 'currency':
                            console.warn('Currency cell edit not implemented yet');
                            return <Input ref={inputRef} onPressEnter={save} onBlur={save} />;
                    }
                })()}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    // paddingRight: 24
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td { ...props }>{childNode}</td>
}

export interface EditableTableProps<T extends object> {
    columns: EditableColumnsType<T>,
    dataSource: readonly T[],
    handleSave: (record: T) => void
}
export const EditableTable = <T extends object>(props: EditableTableProps<T>) => {
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell
        }
    };
    const columns = props.columns.map((col) =>
        !((col as any)?.editable === true) ?
        col : ({
            ...col,
            onCell: (record: T, index?: number): EditableCellProps<T> => ({
                record,
                ...col,
                editable: (col as EditableColumn<T>).editable ?? false,
                // editCell: (col as EditableColumn<T>).editCell,
                // editOptions: (col as EditableColumn<T>).editOptions,
                // editRenderValue: (col as EditableColumn<T>).editRenderValue,
                // editRenderLabel: (col as EditableColumn<T>).editRenderLabel,
                // afterEdit: (col as EditableColumn<T>).afterEdit,
                dataIndex: (col as any).dataIndex,
                title: typeof col.title === 'string'
                    ? col.title
                    : undefined,
                handleSave: props.handleSave
            })
        })
    );

    return (
        <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={props.dataSource}
            columns={columns}
        />
    );
};
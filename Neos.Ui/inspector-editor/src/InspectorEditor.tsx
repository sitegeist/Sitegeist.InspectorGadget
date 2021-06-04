import * as React from 'react';
import arrayMove from 'array-move';

import {Icon, Button} from '@neos-project/react-ui-components';

import {useI18n} from '@sitegeist/inspectorgadget-neos-bridge';
import {useEditorTransactions, Presentation, useEditorForType} from '@sitegeist/inspectorgadget-core';

interface Props {
    neos: unknown
    nodeTypesRegistry: unknown
    validatorRegistry: unknown
    editorRegistry: unknown
    i18nRegistry: unknown
    className: unknown

    id: string
    label: string
    editor: string
    options?: {
        type?: string
        isNullable?: boolean
        isCollection?: boolean
        isSortable?: boolean
        itemType?: string
        labels?: {
            create?: string
            addItem?: string
        }
    }
    helpMessage: string
    helpThumbnail: string
    highlight: boolean
    identifier: string
    value: any
    hooks: null | any
    commit: (value: any) => void
    renderSecondaryInspector: (id: undefined | string, contents: any) => void
}

function useEditValueObject(
    type: string,
    commit: (value: any) => void
): (value: any) => Promise<void> {
    const tx = useEditorTransactions();

    return React.useCallback(async (value: any) => {
        const result = await tx.editValueObject(type, value);

        if (result.change) {
            commit(result.value);
        }
    }, [tx.editValueObject, type, commit]);
}

export const InspectorEditor: React.FC<Props> = props => {
    if (!props.options?.type) {
        const message = `[Sitegeist.InspectorGadget]: Could not determine type of property "${props.identifier}".`;

        console.error(message, props.options);
        return <>{message}</>;
    }

    if (props.options?.isCollection && !props.options?.itemType) {
        const message = `[Sitegeist.InspectorGadget]: Could not determine itemType of collection property "${props.identifier}".`;

        console.error(message, props.options);
        return <>{message}</>;
    }

    return props.options?.isCollection ? (
        <ListEditor
            value={props.value}
            itemType={props.options.itemType!}
            addItemLabel={props.options.labels?.addItem ?? 'Sitegeist.InspectorEditor:Main.addItem'}
            commit={props.commit}
        />
    ) : (
        <SingleItemEditor
            value={props.value}
            type={props.options?.type}
            options={props.options}
            createLabel={props.options?.labels?.create ?? 'Sitegeist.InspectorEditor:Main.create'}
            commit={props.commit}
        />
    );
};

const SingleItemEditor: React.FC<{
    value: undefined | object
    type: string
    options?: {
        isNullable?: boolean
    }
    createLabel: string
    commit(value: '' | object): void
}> = props => {
    const i18n = useI18n();
    const Editor = useEditorForType(props.type);
    const editValueObject = useEditValueObject(props.type, props.commit);
    const deleteValueObject = () => props.commit('');

    return Editor ? props.value ? props.options?.isNullable ? (
        <Presentation.Deletable onDelete={deleteValueObject}>
            <Presentation.Clickable onClick={() => editValueObject(props.value)}>
                <Editor.Preview
                    value={props.value}
                    api={Presentation}
                />
            </Presentation.Clickable>
        </Presentation.Deletable>
    ) : (
        <Presentation.Clickable onClick={() => editValueObject(props.value)}>
            <Editor.Preview
                value={props.value}
                api={Presentation}
            />
        </Presentation.Clickable>
    ) : (
        <Button onClick={() => editValueObject(Editor.defaultValue ?? {})}>
            {i18n(props.createLabel)}
        </Button>
    ) : (
        <>
            Missing Editor for {props.type}
        </>
    );
};

const ListEditor: React.FC<{
    value: undefined | object[]
    itemType: string
    addItemLabel: string
    commit(value: any[]): void
}> = props => {
    const i18n = useI18n();
    const Editor = useEditorForType(props.itemType);
    const addItem = useEditValueObject(props.itemType, React.useCallback((value: any) => {
        props.commit(
            Array.isArray(props.value) ? [...props.value, value] : [value]
        );
    }, [props.commit, props.value]));
    const tx = useEditorTransactions();
    const editItem = React.useCallback(async (initialItemValue: any, itemIndex: number) => {
        const result = await tx.editValueObject(props.itemType, initialItemValue);

        if (result.change) {
            props.commit(
                Array.isArray(props.value) ? props.value.map((currentItemValue, index) => {
                    if (index === itemIndex) {
                        return result.value!;
                    }
                    return currentItemValue;
                }) : [result.value!]
            );
        }
    }, [props.commit, props.value, props.itemType]);
    const deleteItem = React.useCallback((itemIndex: number) => {
        if (Array.isArray(props.value)) {
            props.commit(
                props.value.filter((_, index) => index !== itemIndex)
            );
        }
    }, [props.commit, props.value]);
    const handleDragEnd = React.useCallback((move: {oldIndex: number, newIndex: number}) => {
        if (Array.isArray(props.value)) {
            if (move.oldIndex !== move.newIndex) {
                props.commit(arrayMove(props.value, move.oldIndex, move.newIndex));
            }
        }
    }, [props.value]);

    return Editor ? (
        <Presentation.Layout.Stack>
            {Array.isArray(props.value) ? (
                <Presentation.Sortable.List
                    items={props.value}
                    onSortEnd={handleDragEnd}
                    distance={10}
                    renderItem={(item, index) => (
                        <Presentation.Sortable.Item index={index}>
                            <Presentation.Deletable onDelete={() => deleteItem(index)}>
                                <Presentation.Clickable
                                    onClick={() => editItem(item, index)}
                                >
                                    <Editor.Preview
                                        value={item}
                                        api={Presentation}
                                    />
                                </Presentation.Clickable>
                            </Presentation.Deletable>
                        </Presentation.Sortable.Item>
                    )}
                />
            ) : null}

            <Button onClick={() => addItem(Editor.defaultValue ?? {})}>
                <Icon icon="plus"/>
                &nbsp;&nbsp;&nbsp;
                {i18n(props.addItemLabel)}
            </Button>
        </Presentation.Layout.Stack>
    ) : (
        <>
            Missing Editor for {props.itemType}
        </>
    );
};

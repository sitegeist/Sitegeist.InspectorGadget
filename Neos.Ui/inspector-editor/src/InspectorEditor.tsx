import * as React from 'react';
import cx from 'classnames';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import {Icon, Button} from '@neos-project/react-ui-components';

import {useCurrentlyFocusedNode, useNodeType, useGlobalRegistry, useI18n} from '@sitegeist/inspectorgadget-neos-bridge';
import {useEditorTransactions, Presentation} from '@sitegeist/inspectorgadget-core';

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
        isNullable?: boolean
        isCollection?: boolean
        isSortable?: boolean
        itemType?: string
        addItemLabel?: string
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

interface Editor {
    Preview: React.ComponentType<{
        value: any
        api: typeof Presentation
    }>
}

const SortableItem = SortableElement(({children}: {children: React.ReactElement}) => children);

const SortableList = SortableContainer(({
    items,
    renderItem
}: {
    items: any[]
    renderItem: (item: any, index: number) => React.ReactElement
}) => {
  return (
    <div>
      {items.map(renderItem)}
    </div>
  );
});

const StyledButton: React.FC<{
    onClick?: (ev: any) => void
}> = props => (
    <button
        className={cx(
            'sg-ig-block',
            'sg-ig-w-full',
            'sg-ig-p-0',
            'sg-ig-bg-transparent',
            'sg-ig-border-none',
            'sg-ig-cursor-pointer'
        )}
        onClick={props.onClick}
    >
        {props.children}
    </button>
);

function useEditorForType(type: string): undefined | Editor {
    const globalRegistry = useGlobalRegistry();
    const Editor: undefined | Editor = globalRegistry.get('@sitegeist/inspectorgadget/editors')?.get(type ?? '');

    return Editor;
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
    const node = useCurrentlyFocusedNode();
    const nodeType = useNodeType(node.nodeType);
    const propertyConfiguration = nodeType?.properties[props.identifier];

    if (!propertyConfiguration?.type) {
        const message = `[Sitegeist.InspectorGadget]: Could not determine type of property "${props.identifier}".`;

        console.error(message, propertyConfiguration);
        return <>{message}</>;
    }

    if (props.options?.isCollection && !props.options?.itemType) {
        const message = `[Sitegeist.InspectorGadget]: Could not determine itemType of collection property "${props.identifier}".`;

        console.error(message, propertyConfiguration);
        return <>{message}</>;
    }

    return props.options?.isCollection ? (
        <ListEditor
            value={props.value}
            itemType={props.options.itemType!}
            addItemLabel={props.options.addItemLabel ?? 'Sitegeist.InspectorEditor:Main.addItemLabel'}
            commit={props.commit}
        />
    ) : (
        <SingleItemEditor
            value={props.value}
            type={propertyConfiguration.type}
            options={props.options}
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
    commit(value: '' | object): void
}> = props => {
    const Editor = useEditorForType(props.type);
    const editValueObject = useEditValueObject(props.type, props.commit);
    const deleteValueObject = () => props.commit('');

    return Editor ? props.value ? props.options?.isNullable ? (
        <Presentation.Deletable onDelete={deleteValueObject}>
            <StyledButton onClick={() => editValueObject(props.value)}>
                <Editor.Preview
                    value={props.value}
                    api={Presentation}
                />
            </StyledButton>
        </Presentation.Deletable>
    ) : (
        <StyledButton onClick={() => editValueObject(props.value)}>
            <Editor.Preview
                value={props.value}
                api={Presentation}
            />
        </StyledButton>
    ) : (
        <Button onClick={editValueObject}>
            Create Value Object
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
    const addValueObject = useEditValueObject(props.itemType, React.useCallback((value: any) => {
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
                <SortableList
                    items={props.value}
                    onSortEnd={handleDragEnd}
                    distance={10}
                    renderItem={(item, index) => (
                        <SortableItem index={index}>
                            <Presentation.Deletable onDelete={() => deleteItem(index)}>
                                <StyledButton
                                    onClick={() => editItem(item, index)}
                                >
                                    <Editor.Preview
                                        value={item}
                                        api={Presentation}
                                    />
                                </StyledButton>
                            </Presentation.Deletable>
                        </SortableItem>
                    )}
                />
            ) : null}

            <Button onClick={() => addValueObject({})}>
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
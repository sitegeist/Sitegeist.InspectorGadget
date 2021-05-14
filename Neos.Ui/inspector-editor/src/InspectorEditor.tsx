import * as React from 'react';
import styled from 'styled-components';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

import {Button} from '@neos-project/react-ui-components';

import {useCurrentlyFocusedNode, useNodeType, useGlobalRegistry} from '@sitegeist/inspectorgadget-neos-bridge';
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

const SortableItem = SortableElement(({value}: {value: string}) => <li>{value}</li>);

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

const StyledButton = styled.button`
    display: block;
    width: 100%;
    padding: 0;
    background: transparent;
    border: none;
    cursor: pointer;
`;

function useEditorForType(type: string): undefined | Editor {
    const globalRegistry = useGlobalRegistry();
    const Editor: undefined | Editor = globalRegistry.get('@sitegeist/inspectorgadget/editors')?.get(type ?? '');

    return Editor;
}

function useEditValueObject(
    value: any,
    type: string,
    commit: (value: any) => void
): () => Promise<void> {
    const tx = useEditorTransactions();

    return React.useCallback(async () => {
        const result = await tx.editValueObject(type, value);

        if (result.change) {
            commit(result.value);
        }
    }, [tx.editValueObject, value, type, commit]);
}

export const InspectorEditor: React.FC<Props> = props => {
    const node = useCurrentlyFocusedNode();
    const nodeType = useNodeType(node.nodeType);
    const propertyConfiguration = nodeType?.properties[props.identifier];

    if (!propertyConfiguration?.type) {
        const message = `[Sitegeist.InspectorGadget]: Could not determine type of property "${props.identifier}".`;

        console.error(message, propertyConfiguration);
        return <>message</>;
    }

    if (props.options?.isCollection && !props.options?.itemType) {
        const message = `[Sitegeist.InspectorGadget]: Could not determine itemType of collection property "${props.identifier}".`;

        console.error(message, propertyConfiguration);
        return <>message</>;
    }

    return props.options?.isCollection ? (
        <ListEditor
            value={props.value}
            itemType={props.options.itemType!}
            commit={props.commit}
        />
    ) : (
        <SingleItemEditor
            value={props.value}
            type={propertyConfiguration.type}
            commit={props.commit}
        />
    );

    // return (
    //     <div>
    //         {props.value ? Editor ? (
    //             <SortableList
    //                 items={items}
    //                 onSortEnd={handleDragEnd}
    //                 renderItem={(item, index) => (
    //                     <StyledButton onClick={editValueObject} key={String(index)}>
    //                         <Preview
    //                             index={index}
    //                             value={item}
    //                             api={Presentation}
    //                         />
    //                     </StyledButton>
    //                 )}
    //             />
    //         ) : (
    //             <>
    //                 Missing Editor for {type}
    //             </>
    //         ) : (
    //             <Button onClick={editValueObject}>
    //                 Create Value Object
    //             </Button>
    //         )}
    //     </div>
    // );
};

const SingleItemEditor: React.FC<{
    value: undefined | object
    type: string
    commit(value: undefined | object): void
}> = props => {
    const Editor = useEditorForType(props.type);
    const editValueObject = useEditValueObject(props.value, props.type, props.commit);

    return Editor ? props.value ? (
        <StyledButton onClick={editValueObject}>
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
    value: undefined | {array: object[]}
    itemType: string
    commit(value: {array: object[]}): void
}> = props => {
    const Editor = useEditorForType(props.itemType);
    const addValueObject = useEditValueObject({}, props.itemType, React.useCallback((value: any) => {
        props.commit({
            array: [...(props.value?.array ?? []), value]
        });
    }, [props.commit, props.value]));

    return Editor ? (
        <div>
            List Editor
            <Button onClick={addValueObject}>
                Add Value Object
            </Button>
        </div>
    ) : (
        <>
            Missing Editor for {props.itemType}
        </>
    );
};
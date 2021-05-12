import * as React from 'react';

import {Button} from '@neos-project/react-ui-components';

import {useCurrentlyFocusedNode, NeosContext, useNeos, useNodeType, useGlobalRegistry, useSelector} from '@sitegeist/inspectorgadget-neos-bridge';
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
    options: any
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

export const InspectorEditor: React.FC<Props> = props => {
    const node = useCurrentlyFocusedNode();
    const globalRegistry = useGlobalRegistry();
    const nodeType = useNodeType(node.nodeType);
    const {type} = nodeType?.properties[props.identifier]!;
    const tx = useEditorTransactions();
    const editValueObject = React.useCallback(async () => {
        const result = await tx.editValueObject(
            type,
            props.value
        );

        if (result.change) {
            props.commit(result.value);
        }
    }, [props.value, tx.editValueObject, props.options]);

    const Editor: undefined | Editor = globalRegistry.get('@sitegeist/inspectorgadget/editors')?.get(type ?? '');

    return (
        <div>
            {props.value ? Editor ? (
                <button onClick={editValueObject}>
                    <Editor.Preview
                        value={props.value}
                        api={Presentation}
                    />
                </button>
            ) : (
                <>
                    Missing Editor for {type}
                </>
            ) : (
                <Button onClick={editValueObject}>
                    Create Value Object
                </Button>
            )}
        </div>
    );
};
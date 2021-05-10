import * as React from 'react';
import * as ReactFinalForm from 'react-final-form';

import {Button} from '@neos-project/react-ui-components';

import {useCurrentlyFocusedNode, useNodeType, useGlobalRegistry} from '@sitegeist/inspectorgadget-neos-bridge';

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

export const InspectorEditor: React.FC<Props> = props => {
    const globalRegistry = useGlobalRegistry();
    const node = useCurrentlyFocusedNode();
    const nodeType = useNodeType(node.nodeType);
    const {type} = nodeType?.properties[props.identifier]!;
    const Editor: undefined | React.ComponentType<{
        api: typeof ReactFinalForm
    }> = globalRegistry.get('@sitegeist/inspectorgadget/editors')?.get(type);

    const openSecondaryInspector = React.useCallback(() => {
        props.renderSecondaryInspector('SITEGEIST_INSPECTOR_GADGET::' + props.identifier, () => (
            <div>
                <h1>Edit: {props.label}</h1>
                {Editor ? (
                    <ReactFinalForm.Form
                        initialValues={props.value}
                        onSubmit={(values: any) => console.log('Submit', values)}
                    >
                        {({handleSubmit, values}) => {
                            props.commit(values);

                            return (
                                <form onSubmit={handleSubmit}>
                                    <Editor
                                        api={ReactFinalForm}
                                        />
                                </form>
                            );
                        }}
                    </ReactFinalForm.Form>
                ) : `Missing Editor for: "${type}"`}
            </div>
        ));
    }, [props.renderSecondaryInspector, props.label, props.value, props.commit, type])

    console.log('InspectorEditor::type', nodeType?.properties[props.identifier].type);
    console.log('InspectorEditor::options', props.options);

    return (
        <div>
            {props.value ? (
                <pre>{JSON.stringify(props.value, null, 2)}</pre>
            ) : (
                <Button onClick={openSecondaryInspector}>
                    Create Value Object
                </Button>
            )}
        </div>
    );
};
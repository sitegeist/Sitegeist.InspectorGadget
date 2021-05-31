import * as React from 'react';
import {Field as ReactFinalFormField} from 'react-final-form';

import {EditorEnvelope} from '@neos-project/neos-ui-editors';

export const Field: React.FC<{
    name: string
    label: string
    editor: string
    defaultValue?: string
    editorOptions?: object
}> = props => (
    <ReactFinalFormField
        name={props.name}
        defaultValue={props.defaultValue}
    >{({input, meta}: {input: any, meta: any}) => (
        <div className="fix-neos-ui-validation-messages">
            <EditorEnvelope
                identifier={`Sitegeist-InspectorGadget-${props.name}`}
                label={props.label}
                editor={props.editor}
                options={props.editorOptions}
                validationErrors={meta.error ? [meta.error] : []}
                value={input.value}
                commit={input.onChange}
            />
        </div>
    )}</ReactFinalFormField>
);

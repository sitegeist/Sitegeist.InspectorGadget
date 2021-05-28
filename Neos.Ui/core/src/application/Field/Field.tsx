import * as React from 'react';
import {Field as ReactFinalFormField} from 'react-final-form';

import {EditorEnvelope} from '@neos-project/neos-ui-editors';

export const Field: React.FC<{
    name: string
    label: string
    editor: string
    editorOptions?: object
}> = props => (
    <ReactFinalFormField
        name={props.name}
    >{({input, meta}: {input: any, meta: any}) => (
        <div className="fix-neos-ui-validation-messages">
            <EditorEnvelope
                identifier={`Sitegeist-InspectorGadget-${props.name}`}
                label={props.label}
                editor={props.editor}
                options={props.editorOptions}
                validationErrors={(meta.dirty && meta.error) || meta.error?.external ? [meta.error.message] : []}
                value={input.value}
                commit={input.onChange}
            />
        </div>
    )}</ReactFinalFormField>
);

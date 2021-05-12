import * as React from 'react';
import {Field as ReactFinalFormField} from 'react-final-form';

import {EditorEnvelope} from '@neos-project/neos-ui-editors';

export const Field: React.FC<{
    name: string
    label: string
    editor: string
}> = props => (
    <ReactFinalFormField
        name={props.name}
    >{({input, meta}: {input: any, meta: any}) => (
        <EditorEnvelope
            identifier={`Sitegeist-InspectorGadget-${props.name}`}
            label={props.label}
            editor={props.editor}
            validationErrors={(meta.dirty && meta.error) || meta.error?.external ? [meta.error.message] : []}
            value={input.value}
            commit={input.onChange}
        />
    )}</ReactFinalFormField>
);

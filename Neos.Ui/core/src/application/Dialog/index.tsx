import * as React from 'react';
import {INeosContextProperties, NeosContext} from '@sitegeist/inspectorgadget-neos-bridge';

import {createEditor, EditorContext} from '../../domain';
import {DialogContainer} from './Dialog';

export function registerDialog(
    neosContextProperties: INeosContextProperties,
    editor: ReturnType<typeof createEditor>
): void {
    const {globalRegistry} = neosContextProperties;
    const containersRegistry = globalRegistry.get('containers');

    containersRegistry?.set(
        'Modals/Sitegeist.InspectorGadget',
        (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    {React.createElement(DialogContainer, props)}
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    );
}
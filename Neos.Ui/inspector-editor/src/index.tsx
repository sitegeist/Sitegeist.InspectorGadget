import * as React from 'react';

import {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {INeosContextProperties, NeosContext} from '@sitegeist/inspectorgadget-neos-bridge';
import {IEditor, EditorContext} from '@sitegeist/inspectorgadget-core';

import {InspectorEditor} from './InspectorEditor';

export function registerInspectorEditor(
    neosContextProperties: INeosContextProperties,
    editor: IEditor
): void {
    const inspectorRegistry = neosContextProperties.globalRegistry.get('inspector');
    if (!inspectorRegistry) {
        console.warn('[Sitegeist.InspectorGadget]: Could not find inspector registry.');
        console.warn('[Sitegeist.InspectorGadget]: Skipping registration of InspectorEditor...');
        return;
    }

    const editorsRegistry = inspectorRegistry.get<SynchronousRegistry<any>>('editors');
    if (!editorsRegistry) {
        console.warn('[Sitegeist.InspectorGadget]: Could not find inspector editors registry.');
        console.warn('[Sitegeist.InspectorGadget]: Skipping registration of InspectorEditor...');
        return;
    }

    editorsRegistry.set('Sitegeist.InspectorGadget/Inspector/Editor', {
        component: (props: any) => (
            <NeosContext.Provider value={neosContextProperties}>
                <EditorContext.Provider value={editor}>
                    <InspectorEditor {...props}/>
                </EditorContext.Provider>
            </NeosContext.Provider>
        )
    });
}

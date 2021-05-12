import manifest, {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {registerDialog, createEditor} from '@sitegeist/inspectorgadget-core';
import {registerInspectorEditor} from '@sitegeist/inspectorgadget-inspector-editor';

manifest('@sitegeist/inspectorgadget-plugin', {}, (globalRegistry, {store, configuration, routes}) => {
    const neosContextProperties = {globalRegistry, store, configuration, routes};
    const editor = createEditor();

    registerDialog(neosContextProperties, editor);
    registerInspectorEditor(neosContextProperties, editor);

    globalRegistry.set('@sitegeist/inspectorgadget/editors', new SynchronousRegistry(`
        # Sitegeist.InspectorGadget Editors Registry
    `))
});

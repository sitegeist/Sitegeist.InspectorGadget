import manifest, {SynchronousRegistry} from '@neos-project/neos-ui-extensibility';

import {registerInspectorEditor} from '@sitegeist/inspectorgadget-inspector-editor';

manifest('@sitegeist/inspectorgadget-plugin', {}, (globalRegistry, {store, configuration, routes}) => {
    const neosContextProperties = {globalRegistry, store, configuration, routes};
    registerInspectorEditor(neosContextProperties);

    globalRegistry.set('@sitegeist/inspectorgadget/editors', new SynchronousRegistry(`
        # Sitegeist.InspectorGadget Editors Registry
    `))
});

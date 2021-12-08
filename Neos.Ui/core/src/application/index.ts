export {registerDialog} from './Dialog';
export {Field} from './Field';

import {useGlobalRegistry} from '@sitegeist/inspectorgadget-neos-bridge';
import * as Presentation from '../presentation';

interface Editor {
    Preview: React.ComponentType<{
        value: any
        api: typeof Presentation
    }>
    defaultValue?: any
}

export function useEditorForType(type: string): undefined | Editor {
    const globalRegistry = useGlobalRegistry();
    const Editor: undefined | Editor = globalRegistry.get('@sitegeist/inspectorgadget/editors')?.get(type ?? '');

    return Editor;
}

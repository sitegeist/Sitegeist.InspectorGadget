import * as React from 'react';

import {IGlobalRegistry} from './GlobalRegistry';
import {IStore} from './Store';

export interface INeosContextProperties {
    globalRegistry: IGlobalRegistry
    store: IStore
}

export const NeosContext = React.createContext<null | INeosContextProperties>(null);

export function useNeos() {
    const neos = React.useContext(NeosContext);

    if (!neos) {
        throw new Error('[Sitegeist.Archaeopteryx]: Could not determine Neos Context.');
    }

    return neos;
}
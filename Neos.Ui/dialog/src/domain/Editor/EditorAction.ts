import {createAction} from 'typesafe-actions';
import {Value} from './Editor';

export const EditorWasOpened = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasOpened',
    (
        type: string,
        value: null | Value
    ) => ({type, value})
)();

export const EditorWasDismissed = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/EditorWasDismissed'
)();

export const ValueWasUnset = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasUnset'
)();

export const ValueWasReset = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasReset'
)();

export const ValueWasApplied = createAction(
    'http://sitegeist.de/Sitegeist.Archaeopteryx/ValueWasApplied',
    (value: null | Value) => value
)();

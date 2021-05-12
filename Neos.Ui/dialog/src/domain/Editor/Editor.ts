import * as React from 'react';
import {ActionType, getType} from 'typesafe-actions';
import {Subject} from 'rxjs';
import {scan, shareReplay} from 'rxjs/operators';

import * as actions from './EditorAction';

export type Value = object | string | boolean | number;

export interface IEditorState {
    isOpen: boolean
    type: null | string
    value: null | Value
}

type IEditorResult =
    | {change: true, value: null | Value}
    | {change: false}
;

const initialState: IEditorState = {
    isOpen: false,
    type: null,
    value: null
};

export function editorReducer(
    state: IEditorState = initialState,
    action: ActionType<typeof actions>
): IEditorState {
    switch (action.type) {
        case getType(actions.EditorWasOpened):
            return {
                isOpen: true,
                type: action.payload.type,
                value: action.payload.value
            };
        case getType(actions.EditorWasDismissed):
        case getType(actions.ValueWasUnset):
        case getType(actions.ValueWasApplied):
            return {
                ...state,
                isOpen: false,
                type: null,
                value: null
            };
        default:
            return state;
    }
}

export function createEditor() {
    const actions$ = new Subject<ActionType<typeof actions>>();
    const dispatch = (action: ActionType<typeof actions>) => actions$.next(action);
    const state$ = actions$.pipe(
        scan(editorReducer, initialState),
        shareReplay(1)
    );

    const open = (type: string, value: null | Value) => dispatch(
        actions.EditorWasOpened(type, value)
    );
    const dismiss = () => dispatch(actions.EditorWasDismissed());
    const reset = () => dispatch(actions.ValueWasReset());
    const unset = () => dispatch(actions.ValueWasUnset());
    const apply = (value: null | {}) => dispatch(actions.ValueWasApplied(value));
    const editValueObject = (type: string, value: null | Value) => new Promise<IEditorResult>(
        resolve => {
            open(type, value);

            actions$.subscribe(action => {
                switch (action.type) {
                    case getType(actions.EditorWasDismissed):
                        return resolve({change: false});
                    case getType(actions.ValueWasApplied):
                        return resolve({change: true, value: action.payload});
                    default:
                        return;
                }
            });
        }
    );

    return {
        state$,
        tx: {dismiss, unset, reset, apply, editValueObject},
        initialState
    };
}

export type IEditor = ReturnType<typeof createEditor>;

export const EditorContext = React.createContext(createEditor());

export function useEditorState() {
    const {state$, initialState} = React.useContext(EditorContext);
    const [state, setState] = React.useState(initialState);

    React.useEffect(() => {
        const subscription = state$.subscribe(setState);
        return () => subscription.unsubscribe();
    }, [state$, initialState]);

    return state;
}

export function useEditorValue() {
    const {value} = useEditorState();
    return value;
}

export function useEditorTransactions() {
    const {tx} = React.useContext(EditorContext);
    return tx;
}
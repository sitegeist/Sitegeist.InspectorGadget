import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Dialog} from '@neos-project/react-ui-components';

export const Modal: React.FC<{
    renderTitle(): React.ReactNode
    renderBody(): React.ReactNode
}> = props => ReactDOM.createPortal(
    <Dialog
        isOpen={true}
        title={props.renderTitle()}
        onRequestClose={() => {}}
        preventClosing
    >
        {props.renderBody()}
    </Dialog>,
    document.body
);

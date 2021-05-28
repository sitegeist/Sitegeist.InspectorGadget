import * as React from 'react';
import cx from 'classnames';

import {IconButton} from '@neos-project/react-ui-components';

export const Deletable: React.FC<{
    onDelete(): void
}> = props => (
    <div
        className={cx(
            'sg-ig-grid',
            'sg-ig-grid-cols-[1fr,40px]',
            'sg-ig-border sg-ig-border-gray-800',
            'sg-ig-max-w-[420px]'
        )}
    >
        <div>{props.children}</div>
        <IconButton
            icon="trash"
            hoverStyle="error"
            className="sg-ig-h-full"
            onClick={props.onDelete}
            />
    </div>
);
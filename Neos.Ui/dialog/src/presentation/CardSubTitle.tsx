import * as React from 'react';
import cx from 'classnames';

export const CardSubTitle: React.FC = props => (
    <span
        className={cx(
            'sg-ig-u-flex',
            'sg-ig-u-items-center',
            'sg-ig-u-overflow-hidden',
            'sg-ig-u-white-space-nowrap',
            'sg-ig-u-text-overflow-ellipsis',
            'sg-ig-u-typography-small',
            'sg-ig-u-color-gray-500',
            'sg-ig-u-column-start-1',
            'sg-ig-u-column-span-2',
            'sg-ig-u-row-start-2',
            'sg-ig-u-row-span-1',
        )}
    >
        {props.children}
    </span>
);

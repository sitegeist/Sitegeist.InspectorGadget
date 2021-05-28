import * as React from 'react';
import cx from 'classnames';

export const CardSubTitle: React.FC = props => (
    <span
        className={cx(
            'sg-ig-flex',
            'sg-ig-items-center',
            'sg-ig-overflow-hidden',
            'sg-ig-whitespace-nowrap',
            'sg-ig-overflow-ellipsis',
            'sg-ig-text-small',
            'sg-ig-leading-none',
            'sg-ig-text-gray-500',
            'sg-ig-col-start-1',
            'sg-ig-col-span-2',
            'sg-ig-row-start-2',
            'sg-ig-row-span-1'
        )}
    >
        {props.children}
    </span>
);

import * as React from 'react';
import cx from 'classnames';

export const CardTitle: React.FC<{ span: number }> = props => (
    <span
        className={cx(
            'sg-ig-flex',
            'sg-ig-items-center',
            'sg-ig-overflow-hidden',
            'sg-ig-whitespace-nowrap',
            'sg-ig-overflow-ellipsis',
            'sg-ig-leading-none',
            'sg-ig-col-start-2',
            'sg-ig-col-span-1',
            'sg-ig-text-white'
        )}
        style={{
            gridRow: `1 / span ${props.span}`
        }}
    >
        {props.children}
    </span>
)
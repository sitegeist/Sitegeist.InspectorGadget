import * as React from 'react';
import cx from 'classnames';

export const Clickable: React.FC<{
    onClick?: (ev: any) => void;
}> = props => (
    <button
        className={cx(
            'sg-ig-block',
            'sg-ig-w-full',
            'sg-ig-p-0',
            'sg-ig-bg-transparent',
            'sg-ig-border-none',
            'sg-ig-cursor-pointer'
        )}
        onClick={props.onClick}
    >
        {props.children}
    </button>
);

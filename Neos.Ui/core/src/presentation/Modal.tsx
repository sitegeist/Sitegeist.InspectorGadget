import * as React from 'react';
import * as ReactDOM from 'react-dom';
import cx from 'classnames';

export const Modal: React.FC<{
    renderTitle(): React.ReactNode
    renderBody(): React.ReactNode
}> = props => ReactDOM.createPortal(
    <div
        data-ignore_click_outside="true"
        className={cx(
            'sg-ig-fixed',
            'sg-ig-inset-0',
            'sg-ig-bg-[rgba(0,0,0,.9)]',
            'sg-ig-animate-overlay-appear',
            'sg-ig-z-[4]'
        )}
    >
        <div
            className={cx(
                'sg-ig-absolute',
                'sg-ig-top-1/2',
                'sg-ig-left-1/2',
                'sg-ig-transform',
                'sg-ig--translate-x-1/2 sg-ig--translate-y-1/2 sg-ig-scale-100',
                'sg-ig-bg-gray-900',
                'sg-ig-shadow-[0,20px,40px,rgba(0,0,0,.4)]',
                'sg-ig-opacity-100',
                'sg-ig-animate-modal-appear',
                'sg-ig-border-2 sg-ig-border-gray-800'
            )}
        >
            <div
                className={cx(
                    'sg-ig-text-large',
                    'sg-ig-leading-tight',
                    'sg-ig-p-4 sg-ig-pr-[40px]'
                )}
            >
                {props.renderTitle()}
            </div>

            {props.renderBody()}
        </div>
    </div>,
    document.body
);
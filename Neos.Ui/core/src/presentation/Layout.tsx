import * as React from 'react';

export const Container: React.FC = props => (
    <div className="sg-ig-p-4">
        {props.children}
    </div>
);

export const Stack: React.FC = props => (
    <div className="sg-ig-space-y-4">
        {props.children}
    </div>
)

export const Columns: React.FC<{columns: number}> = props => (
    <div
        className="sg-ig-grid sg-ig-gap-4"
        style={{
            gridTemplateColumns: `repeat(${props.columns}, 1fr)`
        }}
    >
        {props.children}
    </div>
);
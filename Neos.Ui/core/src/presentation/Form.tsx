import * as React from 'react';

export const Form: React.FC<{
    onSubmit(ev: React.SyntheticEvent<HTMLFormElement>): void
    renderBody(): React.ReactNode
    renderActions(): React.ReactNode
}> = props => (
    <form
        className="sg-ig-space-y-4"
        onSubmit={props.onSubmit}
    >
        <div className="sg-ig-px-4">
            {props.renderBody()}
        </div>
        <div className="sg-ig-flex sg-ig-justify-end">
            {props.renderActions()}
        </div>
    </form>
);
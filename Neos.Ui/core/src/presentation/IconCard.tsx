import * as React from 'react';
import cx from 'classnames';

import {Icon} from '@neos-project/react-ui-components';
import {CardTitle} from './CardTitle';
import {CardSubTitle} from './CardSubTitle';


interface Props {
    icon: string;
    title: string;
    subTitle?: string;
}

export const IconCard: React.FC<Props> = props => {
    return (
        <div
            className={cx(
                'sg-ig-grid',
                'sg-ig-gap-2',
                'sg-ig-grid-cols-[20px,1fr]',
                'sg-ig-grid-rows-[repeat(2,1fr)]',
                'sg-ig-bg-gray-900',
                'sg-ig-px-4 sg-ig-py-2',
                'min-h-[50px]'
            )}
        >
            <div
                className={cx(
                    'sg-ig-flex',
                    'sg-ig-justify-center',
                    'sg-ig-items-center',
                    'sg-ig-col-start-1',
                    'sg-ig-col-span-1',
                    'sg-ig-row-start-1',
                    props.subTitle ? 'sg-ig-row-span-1' : 'sg-ig-row-span-2'
                )}
            >
                <Icon icon={props.icon}/>
            </div>
            <CardTitle span={props.subTitle ? 1 : 2}>
                {props.title}
            </CardTitle>
            <CardSubTitle>
                {props.subTitle}
            </CardSubTitle>
        </div>
    );
}
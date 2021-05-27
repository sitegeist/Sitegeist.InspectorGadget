declare module '@neos-project/react-ui-components';
declare module '@neos-project/neos-ui-backend-connector';
declare module '@neos-project/neos-ui-editors';

declare module '*.css' {
    const classNames: {[key: string]: string};
    export default classNames;
}
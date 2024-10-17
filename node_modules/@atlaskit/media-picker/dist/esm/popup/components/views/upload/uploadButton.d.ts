/// <reference types="react-redux" />
import React from 'react';
import { BrowserBase } from '../../../../components/browser/browser';
export interface LocalBrowserButtonProps {
    readonly browserRef: React.RefObject<BrowserBase>;
}
export interface LocalBrowserButtonDispatchProps {
    onClick: () => void;
}
export declare type Props = LocalBrowserButtonProps & LocalBrowserButtonDispatchProps;
export declare class LocalBrowserButton extends React.Component<Props> {
    private onUploadClick;
    render(): JSX.Element;
}
declare const _default;
export default _default;

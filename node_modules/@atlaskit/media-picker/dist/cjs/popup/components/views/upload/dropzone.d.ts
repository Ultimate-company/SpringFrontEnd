import React from 'react';
import { Component } from 'react';
import { BrowserBase } from '../../../../components/browser/browser';
export interface DropzoneProps {
    readonly isEmpty?: boolean;
    readonly browserRef: React.RefObject<BrowserBase>;
}
export declare class Dropzone extends Component<DropzoneProps> {
    render(): JSX.Element;
}

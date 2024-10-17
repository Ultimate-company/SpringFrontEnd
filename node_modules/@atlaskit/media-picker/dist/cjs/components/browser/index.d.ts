import React from 'react';
import { BrowserProps } from './browser';
import { WithMediaClientConfigProps } from '@atlaskit/media-client';
import { BrowserConfig } from '../../types';
declare type BrowserWithMediaClientConfigProps = WithMediaClientConfigProps<Omit<BrowserProps, 'config'> & {
    config?: BrowserConfig;
}>;
declare type BrowserWithMediaClientConfigComponent = React.ComponentType<BrowserWithMediaClientConfigProps>;
declare type State = {
    Browser?: BrowserWithMediaClientConfigComponent;
};
export declare class BrowserLoader extends React.PureComponent<BrowserWithMediaClientConfigProps, State> {
    private mounted;
    static displayName: string;
    static Browser?: BrowserWithMediaClientConfigComponent;
    state: {
        Browser: React.ComponentClass<WithMediaClientConfigProps<Pick<BrowserProps, "ref" | "onError" | "createAnalyticsEvent" | "mediaClient" | "onUploadsStart" | "onPreviewUpdate" | "onEnd" | "isOpen" | "onClose" | "onBrowseFn" | "onCancelFn"> & {
            config?: BrowserConfig | undefined;
        }>, any> | React.FunctionComponent<WithMediaClientConfigProps<Pick<BrowserProps, "ref" | "onError" | "createAnalyticsEvent" | "mediaClient" | "onUploadsStart" | "onPreviewUpdate" | "onEnd" | "isOpen" | "onClose" | "onBrowseFn" | "onCancelFn"> & {
            config?: BrowserConfig | undefined;
        }>> | undefined;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    UNSAFE_componentWillMount(): Promise<void>;
    render(): JSX.Element | null;
}
export {};

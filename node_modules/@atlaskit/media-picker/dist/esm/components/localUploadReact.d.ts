import { Component } from 'react';
import { MediaClient } from '@atlaskit/media-client';
import { UploadService } from '../service/types';
import { UploadEndEventPayload, UploadErrorEventPayload, UploadPreviewUpdateEventPayload, UploadsStartEventPayload, UploadEventPayloadMap, UploadParams } from '../types';
import { UploadComponent } from './component';
import { LocalUploadConfig } from './types';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
export declare type LocalUploadComponentBaseProps = {
    mediaClient: MediaClient;
    config: LocalUploadConfig;
    onUploadsStart?: (payload: UploadsStartEventPayload) => void;
    onPreviewUpdate?: (payload: UploadPreviewUpdateEventPayload) => void;
    onEnd?: (payload: UploadEndEventPayload) => void;
    onError?: (payload: UploadErrorEventPayload) => void;
} & WithAnalyticsEventsProps;
export declare type FailurePayload = {
    status: 'fail';
    uploadDurationMsec: number;
    failReason: any;
};
export declare type SuccessPayload = {
    status: 'success';
    uploadDurationMsec: number;
};
export declare class LocalUploadComponentReact<Props extends LocalUploadComponentBaseProps, M extends UploadEventPayloadMap = UploadEventPayloadMap> extends Component<Props, {}> {
    protected readonly uploadService: UploadService;
    protected uploadComponent: UploadComponent<UploadEventPayloadMap>;
    constructor(props: Props);
    private fireCommencedEvent;
    private fireUploadSucceeded;
    private fireUploadFailed;
    private createAndFireAnalyticsEvent;
    cancel: (uniqueIdentifier?: string | undefined) => void;
    setUploadParams(uploadParams: UploadParams): void;
    private onFilesAdded;
    private onFilePreviewUpdate;
    private onFileConverting;
    private onUploadError;
}
